/**
 * Plain-language explanations for the four risk rules, shown on the landing
 * page, the case study, and anywhere a beginner needs the "so what".
 * Keep the wording simple and honest — no fear-mongering, no jargon walls.
 */
export interface RuleInfo {
  id: "over-privilege" | "dormancy" | "sod-conflict" | "standing-credential";
  title: string;
  whatItMeans: string;
  whyItMatters: string;
  howToFix: string;
  example: string;
}

export const RULE_INFO: RuleInfo[] = [
  {
    id: "over-privilege",
    title: "Over-privilege",
    whatItMeans:
      "This agent holds admin-level roles even though it is a machine, not a person.",
    whyItMatters:
      "If the agent's credential leaks, the attacker gets admin access. Machines should get exactly the permissions their job needs — nothing more.",
    howToFix:
      "Remove the admin-level roles and grant only the specific entitlements this agent actually uses (least privilege).",
    example:
      "A payment bot that only needs to read invoices, but holds realm-admin in Keycloak.",
  },
  {
    id: "dormancy",
    title: "Dormancy",
    whatItMeans:
      "This agent is still enabled but has not been active for longer than the allowed threshold.",
    whyItMatters:
      "Forgotten service accounts keep working credentials nobody watches — a quiet entry point that no review campaign catches.",
    howToFix:
      "Confirm with the owner whether the agent is still needed; disable it if not, and set a review date if it is.",
    example:
      "A data-sync account from a migration project that ended months ago, still enabled.",
  },
  {
    id: "sod-conflict",
    title: "Separation of duties",
    whatItMeans:
      "This agent holds two duties that must never be combined on one identity.",
    whyItMatters:
      "Controls like four-eyes approval assume the initiator and approver are different identities. One agent holding both removes the control entirely.",
    howToFix:
      "Split the conflicting duties across separate identities, or add a compensating approval step outside the agent.",
    example:
      "One bot that can both initiate payments and approve them — it can pay anyone, alone.",
  },
  {
    id: "standing-credential",
    title: "Standing credentials",
    whatItMeans:
      "This agent has a secret that never expires or is older than the allowed maximum age.",
    whyItMatters:
      "Long-lived secrets are a common attack path: a leaked copy stays valid indefinitely, and nobody notices it is being used.",
    howToFix:
      "Rotate the secret, set an expiry date, and move toward short-lived credentials issued on demand.",
    example:
      "An OAuth client secret created three years ago with no expiry, still accepted today.",
  },
];
