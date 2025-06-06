"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { ChevronDown, Star } from "lucide-react"
import { useProductQuantityStore, useShoppingCartStore } from "@/lib/store"
import Navbar from "@/components/navbar"
import toast from "react-hot-toast"
import { getProductRatings, getProductReviews } from "@/data/review"
import FAQ from "@/components/faq"
import ProductReviews from "@/components/product-reviews"
import { getAuth } from "firebase/auth"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface Product {
  id: string
  name: string
  price: number
  image: string
  isFavorite: boolean
  category: string
  material: string
  occasion: string
  modelNumber: string
  description: string
  weight: string
  shopFor: string
  reviews: number
  rating: number
}

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const auth = getAuth()
  const user = auth.currentUser
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isPincodeChecked, setPincodeChecked] = useState(false)
  const [pincode, setPincode] = useState("")

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const productRatings = getProductRatings(params.id)
  const productReviews = getProductReviews(params.id)

  const { getQuantity, increment, decrement } = useProductQuantityStore()
  const quantity = getQuantity(params.id)
  const { addItem } = useShoppingCartStore()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error("Product not found")
        }
        const data = await response.json()
        setProduct(data)
        setIsFavorite(data.isFavorite)
      } catch (error) {
        console.error("Error fetching product:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleWishlistButton = async () => {
    if (!user?.email) {
      toast.error("Please login to add to wishlist")
      router.push("/login")
      return
    }

    if (isFavorite) {
      toast.error("Product is already in wishlist")
      return
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          action: "add",
          product: {
            productId: params.id,
            name: product?.name,
            price: product?.price,
            image: product?.image,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update wishlist")
      }

      setIsFavorite(true)
      toast.success("Added to wishlist")
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast.error("Failed to add to wishlist")
    }
  }

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user?.email || !params.id) return

      try {
        const response = await fetch(`/api/wishlist?email=${user.email}`)
        if (!response.ok) throw new Error("Failed to fetch wishlist")

        const products = await response.json()
        const isInWishlist = products.some((p: any) => p.productId === params.id)
        setIsFavorite(isInWishlist)
      } catch (error) {
        console.error("Error checking wishlist:", error)
      }
    }

    checkWishlist()
  }, [user?.email, params.id])

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price)

  const handleAddToCart = async () => {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user?.email) {
      toast.error("Please login to add items to cart")
      router.push("/login")
      return
    }

    if (!product) return

    try {
      const cartItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          item: cartItem,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to cart")
      }

      toast.success("Added to cart successfully")
      router.push("/cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart")
    }
  }

  const handlePincode = () => {
    if (pincode.length === 6) {
      setPincodeChecked(true)
    } else {
      toast.error("Invalid Pincode")
    }
  }

  const formatDeliveryDate = (date: Date) => {
    return (
      date.getDate() +
      (date.getDate() === 1 ? "st" : date.getDate() === 2 ? "nd" : date.getDate() === 3 ? "rd" : "th") +
      " " +
      date.toLocaleString("default", { month: "short" })
    )
  }
  const Day = 1 * 24 * 60 * 60 * 1000

  const FastestDeliveryDate = formatDeliveryDate(new Date(Date.now() + 7 * Day))
  const SlowestDeliveryDate = formatDeliveryDate(new Date(Date.now() + 14 * Day))

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="pt-[180px] px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-4">
            <Carousel className="w-full" currentIndex={currentImageIndex} onIndexChange={setCurrentImageIndex}>
              <CarouselContent>
                {[1, 2, 3, 4].map((i) => (
                  <CarouselItem key={i}>
                    <div className="relative w-full aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={product.image || `/placeholder.svg?height=600&width=600&query=emerald+necklace+view+${i}`}
                        alt={`${product.name} view ${i}`}
                        fill
                        className="object-cover"
                        priority={i === 1}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious
                className="left-4"
                onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : 3))}
              />
              <CarouselNext
                className="right-4"
                onClick={() => setCurrentImageIndex((prev) => (prev < 3 ? prev + 1 : 0))}
              />
            </Carousel>

            <div className="flex gap-4 justify-center">
              {[1, 2, 3, 4].map((i, index) => (
                <div
                  key={i}
                  className={`relative w-20 h-20 overflow-hidden rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    currentImageIndex === index
                      ? "border-[#1a1a1a] ring-2 ring-[#1a1a1a] ring-opacity-20"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={product.image || `/placeholder.svg?height=100&width=100&query=emerald+necklace+thumbnail+${i}`}
                    alt={`${product.name} thumbnail ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif text-[#1a1a1a]">{product.name}</h1>
              <p className="text-[#1a1a1a] mt-1">Model number: {product.modelNumber}</p>
            </div>

            <div>
              <p className="text-3xl font-medium text-[#1a1a1a]">{formattedPrice}</p>
            </div>

            <p className="text-[#1a1a1a] leading-relaxed">{product.description}</p>

            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#f8bf3e] text-[#f8bf3e]" />
              ))}
              <span className="ml-2 text-[#1a1a1a]">({product.reviews} Reviews)</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleWishlistButton}
                className="flex-1 py-3 px-4 border border-[#1a1a1a] rounded-md text-[#1a1a1a] font-medium"
              >
                Add to Wishlist
              </button>
              <button
                className="flex-1 py-3 px-4 bg-[#1a1a1a] rounded-md text-white font-medium"
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#cccccc]">
              <p className="font-medium text-[#1a1a1a]">Delivery availability</p>
              <div className="flex">
                <input
                  type="text"
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter Pincode"
                  className="flex-1 px-4 py-2 border border-[#cccccc] rounded-l-md focus:outline-none"
                />
                <button onClick={() => handlePincode()} className="px-4 py-2 bg-[#1a1a1a] text-white rounded-r-md">
                  Check
                </button>
              </div>
              {isPincodeChecked ? (
                <p className="text-sm text-red-400">
                  Free Delivery if ordered today Get it by <strong>{FastestDeliveryDate}</strong> to{" "}
                  <strong>{SlowestDeliveryDate}</strong>
                </p>
              ) : (
                <p className="">Please enter PIN code to check delivery time.</p>
              )}
            </div>

            <div className="pt-4 border-t border-[#cccccc]">
              <button className="flex w-full justify-between items-center text-[#1a1a1a] font-medium">
                <span>Product Details</span>
                <ChevronDown className="w-5 h-5" />
              </button>

              <div className="mt-4 space-y-2 text-[#1a1a1a]">
                <p>
                  <span className="font-medium">Material:</span> {product.material || "Emerald, Diamond and Platinum"}
                </p>
                <p>
                  <span className="font-medium">Occasion:</span> {product.occasion || "Wedding and Formal"}
                </p>
                <p>
                  <span className="font-medium">Shop for:</span> {product.shopFor || "Woman"}
                </p>
                <p>
                  <span className="font-medium">Product weight:</span> {product.weight || "200g"}
                </p>
                <p>
                  <span className="font-medium">Category:</span> {product.category}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        <ProductReviews
          averageRating={productRatings.averageRating}
          totalReviews={productRatings.totalReviews}
          ratingCounts={productRatings.ratingCounts}
          reviews={productReviews}
        />
      </main>
      <FAQ />
    </div>
  )
}
