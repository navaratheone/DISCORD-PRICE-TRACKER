import { Unbounded } from "next/font/google";
import localFont from "next/font/local";

// Unbounded replaces Discord's licensed Ginto Nord display face.
export const display = Unbounded({
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
});

export const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-sans-loaded",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["ui-sans-serif", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const spaceMono = localFont({
  src: "./fonts/space-mono-latin.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-mono-loaded",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const fontVariables = [display, spaceGrotesk, spaceMono].map((face) => face.variable).join(" ");
