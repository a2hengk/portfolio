import Header from "@/components/Header/header";
import Footer from "@/components/footer/footer";
import "./globals.css";

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
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}