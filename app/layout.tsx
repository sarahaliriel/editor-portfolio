import "./globals.css"
import { Montserrat, Inter } from "next/font/google"
import { LanguageProvider } from "@/components/i18n"
import LanguageToggle from "@/components/language-toggle"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <LanguageProvider>
          {children}
          <LanguageToggle />
        </LanguageProvider>
      </body>
    </html>
  )
}