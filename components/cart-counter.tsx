"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useShoppingCartStore } from "@/lib/store"

interface CartCounterProps {
  isHomePage?: boolean
}

export default function CartCounter({ isHomePage = false }: CartCounterProps) {
  const { items } = useShoppingCartStore()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  
  const iconColor = isHomePage ? "text-white" : "text-black"

  return (
    <Link href="/cart" className="relative p-2">
      <ShoppingCart className={`h-5 w-5 ${iconColor}`} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          {itemCount}
        </span>
      )}
    </Link>
  )
}
