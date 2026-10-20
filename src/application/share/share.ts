import { svaion } from "@/contexts/company/svaion";

/** The link-preview image shown when a page is shared in Messenger, Viber, LinkedIn, or X. */
export interface ShareImageView {
  readonly headline: string;
  readonly domain: string;
  readonly alt: string;
  /** The image's file name in the static export; the .png extension makes hosts serve it as image/png. */
  readonly id: string;
  /** Site-relative path of the exported image, for pages that set their own openGraph or twitter metadata. */
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly type: "image/png";
}

const id = "share.png";

export function getShareImage(): ShareImageView {
  return {
    headline: svaion.headline,
    domain: svaion.domain,
    alt: `${svaion.presentationName}: ${svaion.headline}`,
    id,
    // Where src/app/opengraph-image.tsx exports the image with this id.
    url: `/opengraph-image/${id}`,
    width: 1200,
    height: 630,
    type: "image/png",
  };
}
