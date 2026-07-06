import type { NextConfig } from "next";

// GITHUB_PAGES is set by the deploy workflow so the app is served
// correctly from https://joe07here.github.io/cyberlens/
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/cyberlens" : "",
};

export default nextConfig;
