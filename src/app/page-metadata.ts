import type { Metadata } from "next";
import { getShareImage } from "@/application/share/share";
import { getSiteMeta } from "@/application/site/site";
import type { PageMeta } from "@/application/site/view";

const { siteName } = getSiteMeta();
const { url, width, height, alt, type } = getShareImage();
const images = [{ url, width, height, alt, type }];

/**
 * One page's head. Next.js replaces a nested object like openGraph whole, dropping the share image
 * from ./opengraph-image.tsx on pages below the root, so each page restates it in full.
 */
export function pageMetadata(meta: PageMeta): Metadata {
  const description = meta.shareDescription ?? meta.description;
  return {
    title: meta.title,
    description: meta.description,
    ...(meta.path && { alternates: { canonical: meta.path } }),
    openGraph: {
      type: "website",
      siteName,
      title: meta.title,
      description,
      images,
      ...(meta.path && { url: meta.path }),
    },
    twitter: { card: "summary_large_image", title: meta.title, description, images },
  };
}
