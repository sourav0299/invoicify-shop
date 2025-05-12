"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface WishlistCounterProps {
  isHomePage?: boolean
}

export default function WishlistCounter({ isHomePage = false }: WishlistCounterProps) {
  const [wishlistCount, setWishlistCount] = useState(0)
  const router = useRouter()

  // Listen for wishlist updates
  useEffect(() => {
    // Function to fetch wishlist count from API
    const fetchWishlistCount = async () => {
      try {
        // Check if user is logged in
        const auth = (window as any).firebase?.auth?.()
        const user = auth?.currentUser

        if (user && user.email) {
          // Try to fetch from wishlist API first
          try {
            const response = await fetch(`/api/wishlist?email=${user.email}&countOnly=true`)
            if (response.ok) {
              const data = await response.json()
              return typeof data.count === "number" ? data.count : 0
            }
          } catch (e) {
            console.error("Error fetching from wishlist API:", e)
          }
        }

        // Fallback: Fetch all products and count favorites
        const response = await fetch("/api/products")
        if (!response.ok) throw new Error("Failed to fetch products")

        const data = await response.json()
        const favoriteProducts = Array.isArray(data) ? data.filter((product: any) => product.isFavorite) : []
        return favoriteProducts.length
      } catch (error) {
        console.error("Error fetching wishlist count:", error)
        return 0
      }
    }

    // Initial wishlist count
    fetchWishlistCount().then(setWishlistCount)

    // Listen for wishlist update events
    const handleWishlistUpdate = (event: CustomEvent<{ count: number }>) => {
      if (event.detail && typeof event.detail.count === "number") {
        setWishlistCount(event.detail.count)
      } else {
        // If count is not provided, fetch from API
        fetchWishlistCount().then(setWishlistCount)
      }
    }

    // Add event listener for wishlist updates
    window.addEventListener("wishlistUpdated", handleWishlistUpdate as EventListener)

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate as EventListener)
    }
  }, [])

  const handleWishlistClick = () => {
    router.push("/wishlist")
  }

  const textColor = isHomePage ? "text-white" : "text-black"
  const bgColor = isHomePage ? "bg-white text-black" : "bg-black text-white"

  return (
    <button onClick={handleWishlistClick} aria-label="Wishlist" className={`relative p-2 ${textColor}`}>
      <Heart className="h-5 w-5" />
      {wishlistCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs rounded-full ${bgColor}`}
        >
          {wishlistCount}
        </span>
      )}
    </button>
  )
}
