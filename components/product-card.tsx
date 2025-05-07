"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from 'lucide-react'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  isFavorite?: boolean
  onToggleFavorite?: (id: string, isFavorite: boolean) => void
}

export default function ProductCard({ 
  id, 
  name, 
  price, 
  image, 
  isFavorite = false,
  onToggleFavorite
}: ProductCardProps) {
  const [favorite, setFavorite] = useState(isFavorite)
  
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

  const handleToggleFavorite = () => {
    const newFavoriteStatus = !favorite
    setFavorite(newFavoriteStatus)
    

    if (onToggleFavorite) {
      onToggleFavorite(id, newFavoriteStatus)
    }
  }

  return (
    <div className="group relative w-[384px] h-[288px] flex flex-col">
      <div className="relative flex-1 overflow-hidden rounded-[16px] bg-[#f9f9f9]">
        <Link href={`/product/${id}`}>
          <div className="h-[220px] w-full overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={384}
              height={220}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        <button
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-[#f5f5f5]"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          onClick={handleToggleFavorite}
        >
          <Heart 
            className={`h-5 w-5 ${favorite ? "fill-[#f30808] text-[#f33333]" : "text-[#1a1a1a]"}`} 
          />
        </button>
      </div>

      <div className="py-2 space-y-1">
        <Link href={`/product/${id}`} className="block">
          <h3 className="text-base font-medium text-[#1a1a1a] transition-colors hover:text-[#666666] truncate">
            {name}
          </h3>
        </Link>
        <p className="text-base font-medium text-[#1a1a1a]">{formattedPrice}</p>
      </div>
    </div>
  )
}
