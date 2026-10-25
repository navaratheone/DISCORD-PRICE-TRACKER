import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
// @ts-ignore: allow side-effect import of CSS in Next.js app directory
import "./globals.css";

const SITE = "https://pricetracker.bot";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Plummet — price-drop alerts for your Discord",
    template: "%s · Plummet",
  },
  description:
    "Plummet is a Discord bot that watches product prices across Amazon, eBay, Walmart and more, then pings your server the moment a price drops or a sold-out item is back in stock.",
  keywords: [
    "discord price tracker",
    "price drop alerts",
    "discord bot",
    "deal alerts",
    "stock alerts",
  ],
  openGraph: {
    type: "website",
    url: SITE,
    title: "Plummet — price-drop alerts for your Discord",
    description:
      "Track any product. Get pinged the second it drops. A Discord-first price watchdog with a read-only analytics dashboard.",
    siteName: "Plummet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plummet — price-drop alerts for your Discord",
    description: "Track any product. Get pinged the second it drops.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#091a23",
  colorScheme: "dark",
};

// Entrances arm only once script has marked the document, so nothing is hidden from a visitor without it.
const MARK_JS = 'document.documentElement.classList.add("js")';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-rds-root
      data-rds-theme="midnight"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARK_JS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
