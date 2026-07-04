import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseMidpoint } from "@/lib/adapters/midpoint";

const xml = readFileSync(path.resolve("samples/midpoint-export.xml"), "utf8");

describe("parseMidpoint", () => {
  const identities = parseMidpoint(xml);
  const byName = new Map(identities.map((i) => [i.name, i]));

  it("reads every user from the export", () => {
    expect(identities).toHaveLength(5);
    expect([...byName.keys()].sort()).toEqual([
      "alice.chen",
      "bob.admin",
      "svc-data-sync",
      "svc-payment-bot",
      "svc-report-gen",
    ]);
  });

  it("captures roles as access entries", () => {
    const bot = byName.get("svc-payment-bot")!;
    expect(bot.access.map((a) => a.name).sort()).toEqual([
      "admin",
      "payment-approver",
      "payment-initiator",
    ]);
    expect(bot.access.every((a) => a.source === "midpoint")).toBe(true);
  });

  it("reads owner, enabled state and last activity", () => {
    const bot = byName.get("svc-payment-bot")!;
    expect(bot.owner).toBe("finance-team");
    expect(bot.enabled).toBe(true);
    expect(bot.lastActivityAt).toBe("2026-06-20T11:02:00Z");
  });

  it("reads the password credential with its creation date", () => {
    const bot = byName.get("svc-payment-bot")!;
    expect(bot.credentials).toHaveLength(1);
    expect(bot.credentials[0].type).toBe("password");
    expect(bot.credentials[0].createdAt).toBe("2023-01-15T08:00:00Z");
  });

  it("leaves classification to normalize (type still unknown)", () => {
    expect(byName.get("svc-payment-bot")!.type).toBe("unknown");
  });
});
