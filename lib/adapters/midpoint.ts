/**
 * MidPoint source adapter.
 *
 * Parses a MidPoint XML user export into the canonical Identity[] model.
 * `removeNSPrefix` lets us tolerate real exports that namespace elements as
 * `c:user`, `c:name`, etc. Read-only — we never write back to MidPoint.
 */
import { XMLParser } from "fast-xml-parser";
import type { Access, Credential, Identity } from "@/lib/model/types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  removeNSPrefix: true,
  textNodeName: "#text",
  parseTagValue: false,
  trimValues: true,
});

type XmlNode = Record<string, unknown>;

function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/** Read the text content of a node that may be a string or an element object. */
function text(node: unknown): string | undefined {
  if (node === undefined || node === null) return undefined;
  if (typeof node === "string") return node.trim() || undefined;
  if (typeof node === "number" || typeof node === "boolean") return String(node);
  if (typeof node === "object") {
    const t = (node as XmlNode)["#text"];
    if (typeof t === "string") return t.trim() || undefined;
    if (t !== undefined && t !== null) return String(t);
  }
  return undefined;
}

function attr(node: unknown, name: string): string | undefined {
  if (node && typeof node === "object") {
    const v = (node as XmlNode)[`@_${name}`];
    return v !== undefined && v !== null ? String(v) : undefined;
  }
  return undefined;
}

function readAccess(user: XmlNode): Access[] {
  const access: Access[] = [];
  for (const assignment of toArray<XmlNode>(user.assignment as never)) {
    const ref = assignment.targetRef;
    const name = text(ref) ?? attr(ref, "oid");
    if (!name) continue;
    const refType = (attr(ref, "type") ?? "").toLowerCase();
    const kind: Access["kind"] = refType.includes("org") ? "org" : "role";
    access.push({
      id: attr(ref, "oid") ?? name,
      name,
      kind,
      source: "midpoint",
    });
  }
  return access;
}

function readCredentials(user: XmlNode): Credential[] {
  const credentials: Credential[] = [];
  const creds = user.credentials as XmlNode | undefined;
  const password = creds?.password as XmlNode | undefined;
  if (password) {
    const meta = password.metadata as XmlNode | undefined;
    credentials.push({
      id: `midpoint:${text(user.name) ?? "unknown"}:password`,
      type: "password",
      source: "midpoint",
      createdAt: text(meta?.createTimestamp),
      // MidPoint passwords have no fixed expiry in the export: leave unknown.
      expiresAt: undefined,
    });
  }
  return credentials;
}

/** Pull user-like nodes out of whatever wrapper the export used. */
function collectUsers(parsed: XmlNode): XmlNode[] {
  const root = (parsed.objects as XmlNode) ?? parsed;
  const users: XmlNode[] = [...toArray<XmlNode>(root.user as never)];
  // Some exports use <object xsi:type="UserType">.
  for (const obj of toArray<XmlNode>(root.object as never)) {
    const type = (attr(obj, "type") ?? attr(obj, "xsi:type") ?? "").toLowerCase();
    if (type.includes("user")) users.push(obj);
  }
  // Or the root itself is a single user.
  if (users.length === 0 && root.name && root.assignment) users.push(root);
  return users;
}

export function parseMidpoint(xml: string): Identity[] {
  const parsed = parser.parse(xml) as XmlNode;
  const users = collectUsers(parsed);

  return users.map((user, index) => {
    const name = text(user.name) ?? attr(user, "oid") ?? `midpoint-user-${index}`;
    const oid = attr(user, "oid") ?? name;
    const activation = user.activation as XmlNode | undefined;
    const status = text(activation?.administrativeStatus);
    const metadata = user.metadata as XmlNode | undefined;

    const identity: Identity = {
      id: `midpoint:${oid}`,
      source: "midpoint",
      sourceId: oid,
      name,
      displayName: text(user.fullName),
      type: "unknown",
      enabled: status ? status.toLowerCase() !== "disabled" && status.toLowerCase() !== "archived" : true,
      owner: text(user.ownerRef),
      email: text(user.emailAddress),
      createdAt: text(metadata?.createTimestamp),
      lastActivityAt:
        text(user.lastLoginTimestamp) ?? text(activation?.lastLoginTimestamp),
      access: readAccess(user),
      credentials: readCredentials(user),
    };
    return identity;
  });
}
