import { Inter } from "next/font/google"
import { ThemeProvider } from "@/providers/theme-provider"
import "./globals.css"
import type React from "react" // Import React
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Weather App",
  description: "A simple weather app built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <SpeedInsights/>
        </ThemeProvider>
      </body>
    </html>
  )
}

