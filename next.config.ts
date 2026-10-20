import type { NextConfig } from "next";

// Static export: the site is plain files on a CDN, with no server and no database (docs/adr/0002).
const nextConfig: NextConfig = {
  output: "export",
  // Every page is a folder with an index.html, which any static host serves without rewrite rules.
  trailingSlash: true,
};

export default nextConfig;
