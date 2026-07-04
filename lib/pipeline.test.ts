import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { runScan } from "@/lib/pipeline";
import type { Finding } from "@/lib/model/types";

const midpointXml = readFileSync(path.resolve("samples/midpoint-export.xml"), "utf8");
const keycloakJson = readFileSync(path.resolve("samples/keycloak-realm.json"), "utf8");

// Fix "now" so dormancy / credential-age assertions are deterministic.
const scan = runScan({
  midpointXml,
  keycloakJson,
  now: new Date("2026-06-22T12:00:00Z"),
});

const findingsFor = (name: string): Finding[] =>
  scan.findings.filter((f) => f.agentName === name);
const rulesFor = (name: string) => findingsFor(name).map((f) => f.rule).sort();

describe("runScan — end to end on the samples", () => {
  it("correlates agents across both systems into one logical identity", () => {
    expect(scan.stats.totalAgents).toBe(6);
    expect(scan.stats.correlatedCount).toBe(3);
    expect(scan.stats.midpointOnly).toBe(2);
    expect(scan.stats.keycloakOnly).toBe(1);

    const bot = scan.agents.find((a) => a.name === "svc-payment-bot")!;
    expect(bot.sources.sort()).toEqual(["keycloak", "midpoint"]);
    expect(bot.matchConfidence).toBe("exact");
    expect(bot.midpoint).toBeDefined();
    expect(bot.keycloak).toBeDefined();
  });

  it("classifies humans vs non-humans", () => {
    expect(scan.stats.humanCount).toBe(2);
    expect(scan.stats.nonHumanCount).toBe(4);
  });

  it("flags the payment bot on all three of its risks", () => {
    expect(rulesFor("svc-payment-bot")).toEqual([
      "over-privilege",
      "sod-conflict",
      "standing-credential",
    ]);
    expect(findingsFor("svc-payment-bot").every((f) => f.level === "high")).toBe(true);
  });

  it("flags the dormant account as medium and its standing secret as high", () => {
    expect(rulesFor("svc-data-sync")).toEqual(["dormancy", "standing-credential"]);
    const dormancy = findingsFor("svc-data-sync").find((f) => f.rule === "dormancy")!;
    expect(dormancy.level).toBe("medium");
  });

  it("flags the Keycloak-only legacy client even with no MidPoint record", () => {
    expect(rulesFor("legacy-integration")).toEqual([
      "over-privilege",
      "standing-credential",
    ]);
  });

  it("scores a human admin lower than a non-human admin", () => {
    const bob = findingsFor("bob.admin").find((f) => f.rule === "over-privilege")!;
    expect(bob.level).toBe("medium");
  });

  it("leaves healthy agents alone", () => {
    expect(findingsFor("svc-report-gen")).toHaveLength(0);
    expect(findingsFor("alice.chen")).toHaveLength(0);
  });

  it("ranks findings worst-first and summarizes", () => {
    expect(scan.summary).toEqual({ total: 8, high: 6, medium: 2, low: 0 });
    const scores = scan.findings.map((f) => f.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});
