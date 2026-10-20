import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getSiteMeta } from "@/application/site/site";
import "@/ui/styles/globals.css";
import "@/ui/styles/additions.css";

// Downloaded at build time and served from our own domain; latin-ext carries the peso sign.
const inter = Inter({ subsets: ["latin", "latin-ext"], axes: ["opsz"], variable: "--font-inter", display: "swap" });

const site = getSiteMeta();

// Each page sets its own title, description, canonical address, and share card (./page-metadata.ts).
export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: site.themeColor,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
