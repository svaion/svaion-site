import type { MetadataRoute } from "next";
import { getSitemap } from "@/application/site/site";

// Written once at build time; a static export has no server to answer later (docs/adr/0002).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemap().map((url) => ({ url }));
}
