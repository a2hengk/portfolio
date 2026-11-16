import { Big_Shoulders, Hanken_Grotesk } from "next/font/google";

// Shared by the [lang] root layout and global-not-found.tsx, which renders
// its own document and so needs the same font variables.

// Headlines, always in caps.
export const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
  // No metric override exists for Big Shoulders, so fall back to something
  // narrow instead of a wide sans that would blow up the giant headlines.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "sans-serif-condensed", "sans-serif"],
});

// Everything else.
export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const fontVariables = `${bigShoulders.variable} ${hankenGrotesk.variable}`;
