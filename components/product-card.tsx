"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from 'lucide-react'
import toast from "react-hot-toast"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

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
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

  const handleToggleFavorite = async () => {
    if (isUpdating) return
    
    const user = auth.currentUser
    if (!user?.email) {
      toast.error("Please login to add to wishlist")
      router.push("/login")
      return
    }

    setIsUpdating(true)
    const newFavoriteStatus = !favorite

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          action: newFavoriteStatus ? 'add' : 'remove',
          product: {
            productId: id,
            name,
            price,
            image
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update wishlist')
      }

      setFavorite(newFavoriteStatus)
      
      if (onToggleFavorite) {
        onToggleFavorite(id, newFavoriteStatus)
      }

      toast.success(
        newFavoriteStatus 
          ? 'Added to Wishlist' 
          : 'Removed from Wishlist'
      )
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error('Failed to update wishlist')
      setFavorite(!newFavoriteStatus)
    } finally {
      setIsUpdating(false)
    }
  }

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlist = async () => {
      const user = auth.currentUser
      if (!user?.email) return

      try {
        const response = await fetch(`/api/wishlist?email=${user.email}`)
        if (!response.ok) throw new Error('Failed to fetch wishlist')

        const products = await response.json()
        const isInWishlist = products.some((p: any) => p.productId === id)
        setFavorite(isInWishlist)
      } catch (error) {
        console.error('Error checking wishlist:', error)
      }
    }

    checkWishlist()
  }, [auth.currentUser, id])

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
