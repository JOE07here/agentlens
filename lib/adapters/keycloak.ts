/**
 * Keycloak source adapter.
 *
 * Parses a Keycloak realm JSON export into the canonical Identity[] model.
 * An OAuth client becomes one agent identity; the matching
 * `service-account-<clientId>` user's roles are folded into it, and the client
 * secret becomes a Credential. Human users are emitted as their own identities.
 * Read-only.
 */
import type { Access, Credential, Identity } from "@/lib/model/types";
import { classificationConfig } from "@/lib/config";

/** Keycloak's own clients — never user-managed agents, so we skip them. */
const SYSTEM_CLIENTS = new Set([
  "account",
  "account-console",
  "admin-cli",
  "broker",
  "realm-management",
  "security-admin-console",
]);

interface KcUser {
  id?: string;
  username?: string;
  enabled?: boolean;
  email?: string;
  createdTimestamp?: number;
  serviceAccountClientId?: string;
  realmRoles?: string[];
  clientRoles?: Record<string, string[]>;
}

interface KcClient {
  id?: string;
  clientId?: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  publicClient?: boolean;
  serviceAccountsEnabled?: boolean;
  secret?: string;
  attributes?: Record<string, string>;
}

interface KcRealm {
  realm?: string;
  users?: KcUser[];
  clients?: KcClient[];
}

function epochSecondsToIso(value?: string): string | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return undefined;
  return new Date(seconds * 1000).toISOString();
}

function epochMillisToIso(value?: number): string | undefined {
  if (!value || !Number.isFinite(value)) return undefined;
  return new Date(value).toISOString();
}

/** Flatten realmRoles + clientRoles into canonical Access entries. */
function rolesToAccess(user: KcUser | undefined): Access[] {
  if (!user) return [];
  const access: Access[] = [];
  for (const role of user.realmRoles ?? []) {
    access.push({ id: role, name: role, kind: "realmRole", source: "keycloak" });
  }
  for (const [client, roles] of Object.entries(user.clientRoles ?? {})) {
    for (const role of roles) {
      access.push({
        id: `${client}:${role}`,
        name: role,
        kind: "clientRole",
        source: "keycloak",
        description: `${client} client role`,
      });
    }
  }
  return access;
}

function isAgentClient(client: KcClient): boolean {
  if (!client.clientId || SYSTEM_CLIENTS.has(client.clientId)) return false;
  if (client.publicClient === true) return false;
  return client.serviceAccountsEnabled === true || Boolean(client.secret);
}

export function parseKeycloak(json: string): Identity[] {
  const realm = JSON.parse(json) as KcRealm;
  const identities: Identity[] = [];

  // Index service-account users by the client they belong to.
  const serviceAccounts = new Map<string, KcUser>();
  const humanUsers: KcUser[] = [];
  for (const user of realm.users ?? []) {
    const linkedClient =
      user.serviceAccountClientId ??
      (user.username?.startsWith("service-account-")
        ? user.username.slice("service-account-".length)
        : undefined);
    if (linkedClient) {
      serviceAccounts.set(linkedClient, user);
    } else {
      humanUsers.push(user);
    }
  }

  // OAuth clients → agent identities (roles + secret folded in).
  for (const client of realm.clients ?? []) {
    if (!isAgentClient(client)) continue;
    const clientId = client.clientId as string;
    const attrs = client.attributes ?? {};
    const credentials: Credential[] = [];
    if (client.secret || attrs["client.secret.creation.time"]) {
      const expiry = attrs["client.secret.expiration.time"];
      credentials.push({
        id: `keycloak:${clientId}:secret`,
        type: "secret",
        source: "keycloak",
        createdAt: epochSecondsToIso(attrs["client.secret.creation.time"]),
        // "0"/absent expiry means the secret never expires: a standing credential.
        expiresAt: epochSecondsToIso(expiry) ?? null,
      });
    }

    identities.push({
      id: `keycloak:${clientId}`,
      source: "keycloak",
      sourceId: client.id ?? clientId,
      name: clientId,
      displayName: client.name ?? client.description,
      type: classificationConfig.keycloakClientsAreNonHuman ? "non-human" : "unknown",
      enabled: client.enabled !== false,
      access: rolesToAccess(serviceAccounts.get(clientId)),
      credentials,
    });
  }

  // Human (interactive) users.
  for (const user of humanUsers) {
    if (!user.username) continue;
    identities.push({
      id: `keycloak:user:${user.id ?? user.username}`,
      source: "keycloak",
      sourceId: user.id ?? user.username,
      name: user.username,
      type: "unknown",
      enabled: user.enabled !== false,
      email: user.email,
      createdAt: epochMillisToIso(user.createdTimestamp),
      access: rolesToAccess(user),
      credentials: [],
    });
  }

  return identities;
}
