import { Cormorant_Garamond, Big_Shoulders } from "next/font/google";

// Shared by the [lang] root layout and global-not-found.tsx, which renders
// its own document and so needs the same font variables.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-big-shoulders",
  display: "swap",
});
