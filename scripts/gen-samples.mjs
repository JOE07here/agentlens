// Generates lib/samples.ts from the canonical files in /samples so the
// in-browser "Load sample data" button has the content with no fetch.
// Run from the project root: node scripts/gen-samples.mjs
import { readFileSync, writeFileSync } from "node:fs";

const esc = (s) =>
  s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");

const xml = readFileSync("samples/midpoint-export.xml", "utf8");
const json = readFileSync("samples/keycloak-realm.json", "utf8");

const out = `/**
 * Bundled sample exports for the in-browser demo. GENERATED from the canonical
 * files in /samples by scripts/gen-samples.mjs — do not edit by hand; edit the
 * sample files and re-run \`node scripts/gen-samples.mjs\`.
 */
export const sampleMidpointXml = \`${esc(xml)}\`;

export const sampleKeycloakJson = \`${esc(json)}\`;
`;

writeFileSync("lib/samples.ts", out);
console.log("Wrote lib/samples.ts");
