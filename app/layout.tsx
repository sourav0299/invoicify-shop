"use client"
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { Toaster } from "react-hot-toast"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  
  const excludedPaths = ["/login", , "/admin/product-listing"]

 
  const shouldExcludeNavbar = excludedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

 
  const isAdminPath = pathname.startsWith("/admin")

  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        {!shouldExcludeNavbar && !isAdminPath && <Navbar />}
        {children}
        {!shouldExcludeNavbar && !isAdminPath && <Footer />}
      </body>
    </html>
  )
}
