import type { MetadataRoute } from "next";
import { getSiteMeta } from "@/application/site/site";

// Written once at build time; a static export has no server to answer later (docs/adr/0002).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${getSiteMeta().siteUrl}/sitemap.xml` };
}
