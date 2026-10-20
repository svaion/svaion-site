import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getHomepage } from "@/application/homepage/homepage";
import "@/ui/styles/globals.css";

// Downloaded at build time and served from our own domain; latin-ext carries the peso sign.
const inter = Inter({ subsets: ["latin", "latin-ext"], axes: ["opsz"], variable: "--font-inter", display: "swap" });

const { meta } = getHomepage();

export const metadata: Metadata = {
  metadataBase: new URL(meta.canonicalUrl),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: meta.canonicalUrl, siteName: meta.siteName, title: meta.title, description: meta.shareDescription },
  twitter: { card: "summary" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: meta.themeColor,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
