import Header from "@/components/Header/header";
import styles from "./layout.module.css";


export default function RootLayout({
  children,
}: {
    children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <Header />
        <main className={styles.main}>
          {children}
        </main>
      </body>
    </html>
  )
}