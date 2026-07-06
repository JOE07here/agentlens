import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ScanProvider } from "./providers";
import { BRAND } from "@/lib/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline.toLowerCase()}`,
  description:
    "Open-source, browser-only scanner for risky non-human / AI-agent identities across MidPoint and Keycloak. Export-based analysis — nothing leaves your browser.",
};

// Runs before anything renders so the stored theme (or the OS preference when
// set to "system") applies without a flash. Must stay in sync with the
// localStorage key used by components/ThemeToggle.tsx.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((t===null||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-canvas font-sans text-ink">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ScanProvider>{children}</ScanProvider>
      </body>
    </html>
  );
}
