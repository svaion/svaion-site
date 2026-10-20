import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getShareImage } from "@/application/share/share";

// Rendered once at build time into the static export; nothing here runs on a server.
export const dynamic = "force-static";

const share = getShareImage();
const size = { width: share.width, height: share.height };

// One image whose id ends in .png, so the export writes out/opengraph-image/share.png and static
// hosts serve it as image/png. A bare opengraph-image.tsx exports an extension-less file instead.
export function generateImageMetadata() {
  return [{ id: share.id, alt: share.alt, size, contentType: share.type }];
}

// Design-system tokens from globals.css; the image renderer cannot read CSS custom properties.
const midnight = "#0B1020";
const signalWhite = "#F8FAFC";
const slateLight = "#94A3B8";
const ionBlue = "#2563EB";

// The signal-path wave fading in below the words, as under the closing section of the homepage.
// The tile is offset by half a period so the pattern sits centred under the centred text.
const waveHeight = 168;
const wave = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${waveHeight}" viewBox="0 0 ${size.width} ${waveHeight}">
<defs>
<pattern id="w" x="-24" width="96" height="96" patternUnits="userSpaceOnUse">
<g fill="none" stroke="${ionBlue}" stroke-opacity="0.6" stroke-width="1.5"><path d="M0 24a24 24 0 0 1 48 0a24 24 0 0 0 48 0"/><path d="M0 72a24 24 0 0 0 48 0a24 24 0 0 1 48 0"/></g>
</pattern>
<linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.7" stop-color="#fff"/></linearGradient>
<mask id="m"><rect width="${size.width}" height="${waveHeight}" fill="url(#f)"/></mask>
</defs>
<rect width="${size.width}" height="${waveHeight}" fill="url(#w)" mask="url(#m)"/>
</svg>`;

const asset = (path: string) => readFile(join(process.cwd(), "src/assets", path));
const svgSource = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

// Centred, so the wordmark survives the square crop some apps use for small previews.
export default async function OpengraphImage() {
  const [wordmark, semiBold, regular] = await Promise.all([
    asset("brand/svaion-wordmark-reverse.svg"),
    asset("fonts/Inter-SemiBold.ttf"),
    asset("fonts/Inter-Regular.ttf"),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: midnight, fontFamily: "Inter" }}>
        <img src={svgSource(wave)} width={size.width} height={waveHeight} alt="" style={{ position: "absolute", left: 0, bottom: 0 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48, width: "100%", padding: "92px 96px 0" }}>
          <img src={svgSource(wordmark.toString())} width={343} height={82} alt="" />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <div style={{ maxWidth: 860, fontSize: 68, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.02em", color: signalWhite, textAlign: "center", textWrap: "balance" }}>
              {share.headline}
            </div>
            <div style={{ fontSize: 28, fontWeight: 400, color: slateLight }}>{share.domain}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: semiBold, style: "normal", weight: 600 },
        { name: "Inter", data: regular, style: "normal", weight: 400 },
      ],
    },
  );
}
