"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Pipeline } from "@/components/Pipeline";
import { FileDrop } from "@/components/FileDrop";
import { GuideSteps } from "@/components/GuideSteps";
import { useScan } from "@/app/providers";
import { runScan } from "@/lib/pipeline";
import { sampleMidpointXml, sampleKeycloakJson } from "@/lib/samples";
import { BRAND } from "@/lib/brand";

interface LoadedFile {
  name: string;
  content: string;
}

function hasExtension(name: string, extensions: string[]): boolean {
  const lower = name.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext));
}

export default function ScanPage() {
  const router = useRouter();
  const { setScan } = useScan();
  const [midpoint, setMidpoint] = useState<LoadedFile | null>(null);
  const [keycloak, setKeycloak] = useState<LoadedFile | null>(null);
  const [midpointError, setMidpointError] = useState<string | null>(null);
  const [keycloakError, setKeycloakError] = useState<string | null>(null);
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
    setMidpointError(null);
    setKeycloakError(null);
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
            Load the sample data below — or drop your own exports. {BRAND.name} correlates the
            same agent across both systems and ranks its risks. Everything runs locally; nothing
            is uploaded.
          </p>
        </section>

        <section className="mt-8">
          <GuideSteps />
        </section>

        <section className="mt-6 rounded-2xl border border-brand/25 bg-brand-soft/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink">New here? Start with the sample data.</h2>
              <p className="mt-0.5 text-sm text-ink-soft">
                Bundled MidPoint + Keycloak demo exports — see a full report without touching your
                own systems.
              </p>
            </div>
            <button
              type="button"
              onClick={loadSample}
              className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90"
            >
              Load sample data
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <FileDrop
              label="1 · MidPoint export"
              accept=".xml,.csv,text/xml,application/xml"
              hint="XML user export from MidPoint (.xml)"
              fileName={midpoint?.name}
              onLoad={(name, content) => {
                if (!hasExtension(name, [".xml", ".csv"])) {
                  setMidpointError(
                    `"${name}" doesn't look like a MidPoint export — expected an .xml file.`,
                  );
                  return;
                }
                setMidpointError(null);
                setMidpoint({ name, content });
              }}
              onClear={() => {
                setMidpoint(null);
                setMidpointError(null);
              }}
            />
            {midpointError && (
              <p className="mt-1.5 text-sm text-red-700 dark:text-red-400">{midpointError}</p>
            )}
          </div>
          <div>
            <FileDrop
              label="2 · Keycloak export"
              accept=".json,application/json"
              hint="JSON realm export from Keycloak (.json)"
              fileName={keycloak?.name}
              onLoad={(name, content) => {
                if (!hasExtension(name, [".json"])) {
                  setKeycloakError(
                    `"${name}" doesn't look like a Keycloak realm export — expected a .json file.`,
                  );
                  return;
                }
                setKeycloakError(null);
                setKeycloak({ name, content });
              }}
              onClear={() => {
                setKeycloak(null);
                setKeycloakError(null);
              }}
            />
            {keycloakError && (
              <p className="mt-1.5 text-sm text-red-700 dark:text-red-400">{keycloakError}</p>
            )}
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
          >
            <p className="font-semibold">The scan couldn&rsquo;t run</p>
            <p className="mt-0.5">{error}</p>
            <p className="mt-1 text-xs opacity-80">
              Check that the file is a MidPoint user export (XML) or a Keycloak realm export
              (JSON) — or use the sample data to see the expected format.
            </p>
          </div>
        )}

        <section className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleScan}
            disabled={!canScan || busy}
            className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Scanning…
              </span>
            ) : (
              "Run scan"
            )}
          </button>
          {!canScan && (
            <span className="text-sm text-ink-soft">
              Nothing loaded yet — add at least one export, or use the sample data above.
            </span>
          )}
        </section>

        <section className="mt-10 rounded-2xl border border-hairline bg-surface p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">
            How a scan runs
          </h2>
          <Pipeline />
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
