"use client"

import { useEffect, useState } from "react"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

interface CartCounterProps {
  isHomePage?: boolean
}

export default function CartCounter({ isHomePage = false }: CartCounterProps) {
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()


  useEffect(() => {
  
    const fetchCartCount = async () => {
      try {
        // Check if user is logged in
        const auth = (window as any).firebase?.auth?.()
        const user = auth?.currentUser

        if (!user || !user.email) return 0

        const response = await fetch(`/api/cart?email=${user.email}&countOnly=true`)
        if (!response.ok) throw new Error("Failed to fetch cart count")

        const data = await response.json()
        return typeof data.count === "number" ? data.count : 0
      } catch (error) {
        console.error("Error fetching cart count:", error)
        return 0
      }
    }


    fetchCartCount().then(setCartCount)

    const handleCartUpdate = (event: CustomEvent<{ count: number }>) => {
      if (event.detail && typeof event.detail.count === "number") {
        setCartCount(event.detail.count)
      } else {
 
        fetchCartCount().then(setCartCount)
      }
    }

 
    window.addEventListener("cartUpdated", handleCartUpdate as EventListener)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate as EventListener)
    }
  }, [])

  const handleCartClick = () => {
    router.push("/cart")
  }

  const textColor = isHomePage ? "text-white" : "text-black"
  const bgColor = isHomePage ? "bg-white text-black" : "bg-black text-white"

  return (
    <button onClick={handleCartClick} aria-label="Cart" className={`relative p-2 ${textColor}`}>
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs rounded-full ${bgColor}`}
        >
          {cartCount}
        </span>
      )}
    </button>
  )
}
