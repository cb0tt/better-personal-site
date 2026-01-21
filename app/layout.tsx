import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"

const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/avatar.avif", type: "image/avif" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-mono antialiased`}>
        {children}
      </body>
    </html>
  )
}
