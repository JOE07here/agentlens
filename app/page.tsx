"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Pipeline } from "@/components/Pipeline";
import { FileDrop } from "@/components/FileDrop";
import { useScan } from "./providers";
import { runScan } from "@/lib/pipeline";
import { sampleMidpointXml, sampleKeycloakJson } from "@/lib/samples";

interface LoadedFile {
  name: string;
  content: string;
}

export default function Home() {
  const router = useRouter();
  const { setScan } = useScan();
  const [midpoint, setMidpoint] = useState<LoadedFile | null>(null);
  const [keycloak, setKeycloak] = useState<LoadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canScan = Boolean(midpoint || keycloak);

  function handleScan() {
    setError(null);
    setBusy(true);
    try {
      const result = runScan({
        midpointXml: midpoint?.content,
        keycloakJson: keycloak?.content,
      });
      setScan(result);
      router.push("/report");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
      setBusy(false);
    }
  }

  function loadSample() {
    setError(null);
    setMidpoint({ name: "midpoint-export.xml (sample)", content: sampleMidpointXml });
    setKeycloak({ name: "keycloak-realm.json (sample)", content: sampleKeycloakJson });
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-10">
        <section className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Find risky agent identities across MidPoint &amp; Keycloak
          </h1>
          <p className="mt-3 text-ink-soft">
            Drop your two exports below. AgentLens correlates the same agent across both systems
            and ranks its risks — over-privilege, dormancy, separation-of-duties, and standing
            credentials. Everything runs locally; nothing is uploaded.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-hairline bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">
            How a scan runs
          </h2>
          <Pipeline />
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <FileDrop
            label="1 · MidPoint export"
            accept=".xml,.csv,text/xml,application/xml"
            hint="XML user export from MidPoint"
            fileName={midpoint?.name}
            onLoad={(name, content) => setMidpoint({ name, content })}
            onClear={() => setMidpoint(null)}
          />
          <FileDrop
            label="2 · Keycloak export"
            accept=".json,application/json"
            hint="JSON realm export from Keycloak"
            fileName={keycloak?.name}
            onLoad={(name, content) => setKeycloak({ name, content })}
            onClear={() => setKeycloak(null)}
          />
        </section>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <section className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleScan}
            disabled={!canScan || busy}
            className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Scanning…" : "Run scan"}
          </button>
          <button
            type="button"
            onClick={loadSample}
            className="text-sm font-medium text-brand underline underline-offset-2 hover:text-ink"
          >
            Load sample data
          </button>
          {!canScan && (
            <span className="text-sm text-ink-soft">Add at least one export to scan.</span>
          )}
        </section>

        <p className="mt-10 flex items-center gap-2 text-xs text-ink-soft">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          Read-only and offline: files are parsed in your browser. No server, no upload, no network
          calls.
        </p>
      </main>
    </>
  );
}
