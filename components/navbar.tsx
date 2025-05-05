"use client"

import Link from "next/link"
import { Search, User, Menu } from "lucide-react"
import CartCounter from "@/components/cart-counter"

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-10 px-4 py-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-serif text-white">
          Nayra Jewels
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="#" className="text-white hover:text-gray-300">
              Collections
            </Link>
            <Link href="#" className="text-white hover:text-gray-300">
              New Arrivals
            </Link>
            <Link href="#" className="text-white hover:text-gray-300">
              Bestsellers
            </Link>
            <Link href="#" className="text-white hover:text-gray-300">
              About Us
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="Search" className="p-2 text-white">
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
