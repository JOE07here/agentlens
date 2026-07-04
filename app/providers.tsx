"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ScanResult } from "@/lib/model/types";

/**
 * Holds the single in-memory scan. Per the privacy rule we keep scan data in
 * React state only — no localStorage, nothing persisted, nothing uploaded.
 * A hard refresh clears it (the report page handles the empty case).
 */
interface ScanContextValue {
  scan: ScanResult | null;
  setScan: (scan: ScanResult | null) => void;
}

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [scan, setScan] = useState<ScanResult | null>(null);
  return <ScanContext.Provider value={{ scan, setScan }}>{children}</ScanContext.Provider>;
}

export function useScan(): ScanContextValue {
  const context = useContext(ScanContext);
  if (!context) throw new Error("useScan must be used inside <ScanProvider>");
  return context;
}
