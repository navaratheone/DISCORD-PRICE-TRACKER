import { Unbounded } from "next/font/google";
import localFont from "next/font/local";

// The display voice and the wordmark: Unbounded (SIL OFL), the closest open match to the ABC Ginto Nord headlines on
// discord.com (wide, near-circular rounds, a straight-legged R), set at Bold as theirs is. Ginto is licensed to
// Discord, so it is never loaded here. next/font serves Unbounded from the site itself, over a metric-matched Arial.
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
