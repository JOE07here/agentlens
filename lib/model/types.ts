/**
 * CyberLens — canonical data model.
 *
 * Every adapter outputs these shapes, and every rule reads them. Keeping the
 * model source-agnostic is what lets us add new IdP adapters later without
 * touching the rule engine (see docs/Architecture_v0.2 §06).
 */

/** Which source system a piece of data came from. */
export type Source = "midpoint" | "keycloak";

/** Human vs. machine. "unknown" when classification can't decide. */
export type IdentityType = "human" | "non-human" | "unknown";

/** Severity of a finding, worst-first. */
export type RiskLevel = "high" | "medium" | "low";

/** An entitlement held by an identity (role, group, scope, …). */
export interface Access {
  /** Stable id within its source system. */
  id: string;
  /** Display name, e.g. "payment-approver". */
  name: string;
  /** What kind of entitlement this is. */
  kind: "role" | "realmRole" | "clientRole" | "group" | "org" | "scope";
  source: Source;
  /** True when the source explicitly marks this as admin/privileged. */
  privileged?: boolean;
  description?: string;
}

/** A credential attached to an identity (client secret, password, key, …). */
export interface Credential {
  id: string;
  type: "secret" | "password" | "apiKey" | "token" | "certificate";
  source: Source;
  /** ISO date the credential was created/issued. */
  createdAt?: string;
  /** ISO date of the last rotation, if known. */
  lastRotatedAt?: string;
  /**
   * ISO expiry date, or `null` when the credential is explicitly set to never
   * expire (a standing credential). `undefined` means "unknown".
   */
  expiresAt?: string | null;
  description?: string;
}

/** A single identity as read from one source system. */
export interface Identity {
  /** Canonical id, unique within a scan. */
  id: string;
  source: Source;
  /** Id in the originating system. */
  sourceId: string;
  /** Username / clientId — the primary correlation handle. */
  name: string;
  displayName?: string;
  type: IdentityType;
  enabled: boolean;
  /** Owner reference (org/team/user) — a secondary correlation handle. */
  owner?: string;
  email?: string;
  /** ISO creation date. */
  createdAt?: string;
  /** ISO date of last login/activity — drives the dormancy rule. */
  lastActivityAt?: string;
  access: Access[];
  credentials: Credential[];
  /** Normalized key used to correlate across systems. */
  correlationKey?: string;
}

/** How confident we are that linked identities are the same real agent. */
export type MatchConfidence = "exact" | "high" | "medium" | "low";

/**
 * One logical agent — the result of correlating identities across systems.
 * This is CyberLens' headline artifact: a service account's MidPoint roles,
 * its Keycloak client, and its secret, all in one place.
 */
export interface CorrelatedAgent {
  id: string;
  name: string;
  displayName?: string;
  type: IdentityType;
  /** Which systems contributed to this agent. */
  sources: Source[];
  /** The MidPoint identity, if present. */
  midpoint?: Identity;
  /** The Keycloak identity/client, if present. */
  keycloak?: Identity;
  /** All linked source identities. */
  identities: Identity[];
  /** Union of access across all linked identities. */
  access: Access[];
  /** Union of credentials across all linked identities. */
  credentials: Credential[];
  enabled: boolean;
  owner?: string;
  /** Most recent activity across linked identities. */
  lastActivityAt?: string;
  /** Plain-language explanation of why these identities were linked. */
  matchReason?: string;
  matchConfidence?: MatchConfidence;
}

/** A risk finding emitted by a rule against a correlated agent. */
export interface Finding {
  id: string;
  /** Rule id, e.g. "over-privilege". */
  rule: string;
  title: string;
  agentId: string;
  agentName: string;
  agentType: IdentityType;
  level: RiskLevel;
  /** Numeric score (0–100) used to rank findings worst-first. */
  score: number;
  /** Plain-language rationale a reviewer can act on. */
  reason: string;
  recommendedAction: string;
  /** Supporting facts (roles, dates, secrets, …). */
  evidence: string[];
}

/** Counts of findings by level. */
export interface RiskSummary {
  total: number;
  high: number;
  medium: number;
  low: number;
}

/** Top-level stats about the population scanned. */
export interface ScanStats {
  totalIdentities: number;
  humanCount: number;
  nonHumanCount: number;
  unknownCount: number;
  totalAgents: number;
  /** Agents present in both MidPoint and Keycloak. */
  correlatedCount: number;
  midpointOnly: number;
  keycloakOnly: number;
}

/** The full result of one scan — everything the report renders from. */
export interface ScanResult {
  scannedAt: string;
  identities: Identity[];
  agents: CorrelatedAgent[];
  findings: Finding[];
  summary: RiskSummary;
  stats: ScanStats;
  /** Non-fatal issues encountered while parsing (surfaced in the UI). */
  warnings: string[];
}
