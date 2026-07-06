/**
 * Beginner-friendly definitions for the technical terms used across the UI.
 * Rendered by <LearnTooltip>. Keep each definition to one or two short
 * sentences a non-IAM person can follow.
 */
export const GLOSSARY = {
  nhi: "Non-human identity — any account that belongs to software instead of a person: service accounts, API keys, workload identities, AI agents.",
  "non-human identity":
    "An account that belongs to software instead of a person — for example a service account, an API key, or an AI agent.",
  "service account":
    "An account used by an application or script — not a person — to log in and access other systems.",
  "workload identity":
    "An identity assigned to a running workload (a container, VM, or job) so it can authenticate without a human.",
  "ai agent":
    "Software that acts autonomously on someone's behalf — and needs credentials and permissions of its own to do it.",
  iga: "Identity Governance & Administration — the discipline (and tooling) for deciding who should have which access, and reviewing it. MidPoint is an IGA platform.",
  idp: "Identity Provider — the system that actually authenticates identities and issues tokens. Keycloak is an IdP.",
  midpoint:
    "An open-source identity governance platform: users, roles, assignments, lifecycle, ownership.",
  keycloak:
    "An open-source identity provider: logins, OAuth clients, service accounts, client secrets, realm roles.",
  sod: "Separation of duties — the rule that certain powers (like requesting and approving a payment) must never sit on one identity.",
  "standing credential":
    "A secret that never expires or is very old. If it leaks, it keeps working until someone notices.",
  "dormant identity":
    "An account that is still enabled but hasn't been used for a long time — nobody is watching it.",
  "least privilege":
    "The principle that every identity should hold exactly the permissions its job needs — nothing extra.",
  "zero trust":
    "A security model that never assumes trust from network location or past behavior — every access is verified, for humans and machines alike.",
  "access review":
    "A periodic check where owners confirm that each identity's access is still needed — the audit ritual CyberLens helps prepare.",
} as const;

export type GlossaryTerm = keyof typeof GLOSSARY;
