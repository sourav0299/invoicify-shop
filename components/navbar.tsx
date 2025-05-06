"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, User, Menu, Mic } from "lucide-react"
import CartCounter from "@/components/cart-counter"
import { useState } from "react"

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <nav className="absolute top-0 left-0 right-0 z-10 px-16 py-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Nayra Jewels Logo" width={30} height={30} />
          </Link>

          <Link href="/" className="flex items-center">
            <Image src="/Nayra Jewels.png" alt="Nayra Jewels Logo" width={120} height={40} className="h-auto w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <div className="relative flex items-center rounded-md border border-white/30 bg-transparent px-3 py-1.5">
              <Search className="h-4 w-4 text-white/70 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white outline-none placeholder:text-white/50 w-40"
              />
              <button aria-label="Voice search" className="ml-1 text-white/70 hover:text-white transition-colors">
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button aria-label="Search" className="md:hidden p-2 text-white">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Account" className="p-2 text-white">
            <User className="h-5 w-5" />
          </button>
          <CartCounter />
          <button aria-label="Menu" className="md:hidden p-2 text-white">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
