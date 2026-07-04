import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseKeycloak } from "@/lib/adapters/keycloak";

const json = readFileSync(path.resolve("samples/keycloak-realm.json"), "utf8");

describe("parseKeycloak", () => {
  const identities = parseKeycloak(json);
  const byName = new Map(identities.map((i) => [i.name, i]));

  it("emits agent clients + human users, skipping system clients", () => {
    expect([...byName.keys()].sort()).toEqual([
      "alice.chen",
      "legacy-integration",
      "svc-data-sync",
      "svc-payment-bot",
    ]);
    expect(byName.has("account")).toBe(false);
    expect(byName.has("admin-cli")).toBe(false);
  });

  it("marks OAuth clients as non-human", () => {
    expect(byName.get("svc-payment-bot")!.type).toBe("non-human");
    expect(byName.get("legacy-integration")!.type).toBe("non-human");
  });

  it("folds the service-account user's roles into the client", () => {
    const bot = byName.get("svc-payment-bot")!;
    expect(bot.access.map((a) => a.name)).toContain("realm-admin");
  });

  it("reads the client secret as a never-expiring credential", () => {
    const bot = byName.get("svc-payment-bot")!;
    expect(bot.credentials).toHaveLength(1);
    expect(bot.credentials[0].type).toBe("secret");
    expect(bot.credentials[0].expiresAt).toBeNull();
    expect(bot.credentials[0].createdAt).toBe("2023-01-15T08:00:00.000Z");
  });

  it("keeps the human user with their realm roles", () => {
    const alice = byName.get("alice.chen")!;
    expect(alice.credentials).toHaveLength(0);
    expect(alice.access.map((a) => a.name)).toContain("user");
  });
});
