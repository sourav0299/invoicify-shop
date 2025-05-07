"use client"

import { useCartStore } from "@/lib/store"
// Using a custom button instead of shadcn/ui

interface AddToCartButtonProps {
  productName: string
  className?: string
}

export default function AddToCartButton({ productName, className }: AddToCartButtonProps) {
  const { inc } = useCartStore()

  const handleAddToCart = () => {
    inc()
   
    console.log(`Added ${productName} to cart`)
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors ${className}`}
    >
      ADD TO CART
    </button>
  )
}
