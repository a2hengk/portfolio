import { Cormorant_Garamond, Big_Shoulders } from "next/font/google";
import Header from "@/components/Header/header";
import Footer from "@/components/footer/footer";
import BackgroundFX from "@/components/Effects/BackgroundFX";
import LaunchControlOverlay from "@/components/Effects/LaunchControlOverlay";
import SecretRaceGame from "@/components/Effects/SecretRaceGame";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-big-shoulders",
  display: "swap",
});

export const metadata = {
  title: "Lunas - Creative Developer",
  description: "Portfolio of Lunas, a creative developer building polished, story-driven experiences.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${bigShoulders.variable}`}>
      <body>
        <BackgroundFX />
        <Header />
        {children}
        <Footer />
        <LaunchControlOverlay />
        <SecretRaceGame />
      </body>
    </html>
  )
}