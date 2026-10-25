import { Mona_Sans } from "next/font/google";
import localFont from "next/font/local";

// The display voice and the wordmark: Mona Sans (SIL OFL, by GitHub), variable in weight and width, set at Black
// and expanded. next/font serves it from the site itself.
export const display = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display-loaded",
  display: "swap",
  preload: true,
  // No "Arial Black" here: the production minifier reads the unquoted name as a colour and drops the stack.
  fallback: ["Impact", "sans-serif"],
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
