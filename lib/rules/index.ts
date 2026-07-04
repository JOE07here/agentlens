/**
 * Rule registry. Each rule reads the correlated model and returns Finding[].
 * Add a new rule by writing one file and listing it here.
 */
import type { CorrelatedAgent, Finding } from "@/lib/model/types";
import { overPrivilege } from "@/lib/rules/overPrivilege";
import { dormancy } from "@/lib/rules/dormancy";
import { sodConflict } from "@/lib/rules/sodConflict";
import { standingCredential } from "@/lib/rules/standingCredential";

export type Rule = (agents: CorrelatedAgent[], now: Date) => Finding[];

export const rules: Rule[] = [overPrivilege, dormancy, sodConflict, standingCredential];

export function runRules(agents: CorrelatedAgent[], now: Date = new Date()): Finding[] {
  return rules.flatMap((rule) => rule(agents, now));
}
