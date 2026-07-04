/**
 * Typed access to the JSON config files. Importing the JSON (rather than
 * fetching it) keeps everything client-side and offline, per the privacy
 * promise — nothing leaves the browser.
 */
import type { RiskLevel } from "@/lib/model/types";
import classificationJson from "@/config/classification.json";
import rulesJson from "@/config/rules.json";
import sodConflictsJson from "@/config/sodConflicts.json";
import correlationJson from "@/config/correlation.json";

export interface ClassificationConfig {
  keycloakClientsAreNonHuman: boolean;
  defaultType: "human" | "non-human" | "unknown";
  nonHumanNamePatterns: string[];
  humanNamePatterns: string[];
}

export interface RuleSeverity {
  level: RiskLevel;
  score: number;
}

export interface RulesConfig {
  overPrivilege: {
    enabled: boolean;
    privilegedRolePatterns: string[];
    nonHuman: RuleSeverity;
    human: RuleSeverity;
  };
  dormancy: {
    enabled: boolean;
    dormantAfterDays: number;
  } & RuleSeverity;
  sodConflict: {
    enabled: boolean;
  } & RuleSeverity;
  standingCredential: {
    enabled: boolean;
    maxCredentialAgeDays: number;
    flagNeverExpires: boolean;
    credentialTypes: string[];
  } & RuleSeverity;
  scoring: {
    thresholds: { high: number; medium: number };
    modifiers: { nonHuman: number; correlatedBothSystems: number };
  };
}

export interface SodConflict {
  a: string;
  b: string;
  reason: string;
}

export interface SodConflictsConfig {
  conflicts: SodConflict[];
}

export interface CorrelationMapping {
  midpoint: string;
  keycloak: string;
  reason: string;
}

export interface CorrelationConfig {
  strategies: ("mapping" | "exactName" | "owner")[];
  normalize: {
    lowercase: boolean;
    stripPrefixes: string[];
    stripNonAlphanumeric: boolean;
  };
  ownerMatchRequiresNonHuman: boolean;
  mappings: CorrelationMapping[];
}

export const classificationConfig =
  classificationJson as unknown as ClassificationConfig;
export const rulesConfig = rulesJson as unknown as RulesConfig;
export const sodConflictsConfig = sodConflictsJson as unknown as SodConflictsConfig;
export const correlationConfig = correlationJson as unknown as CorrelationConfig;
