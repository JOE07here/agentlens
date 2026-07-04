/**
 * Normalize — fold every adapter's output into one list and classify each
 * identity as human or non-human using the patterns in config/classification.json.
 * Adapters may pre-decide a type (e.g. a Keycloak client is always non-human);
 * we only classify the ones still marked "unknown".
 */
import type { Identity, IdentityType } from "@/lib/model/types";
import { classificationConfig } from "@/lib/config";

const nonHumanPatterns = classificationConfig.nonHumanNamePatterns.map(
  (p) => new RegExp(p, "i"),
);
const humanPatterns = classificationConfig.humanNamePatterns.map(
  (p) => new RegExp(p, "i"),
);

function classify(identity: Identity): IdentityType {
  // Trust an adapter that already decided (a Keycloak OAuth client).
  if (identity.type === "human" || identity.type === "non-human") {
    return identity.type;
  }
  const name = identity.name;
  if (nonHumanPatterns.some((re) => re.test(name))) return "non-human";
  if (humanPatterns.some((re) => re.test(name))) return "human";
  return classificationConfig.defaultType;
}

export function normalize(...sources: Identity[][]): Identity[] {
  return sources.flat().map((identity) => ({
    ...identity,
    type: classify(identity),
  }));
}
