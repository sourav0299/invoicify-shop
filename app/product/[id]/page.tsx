"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { ChevronDown, Minus, Plus, Star } from "lucide-react"
import { products } from "@/data/product"
import { getProductRatings, getProductReviews } from "@/data/review"
import { useProductQuantityStore, useShoppingCartStore } from "@/lib/store"
import Navbar from "@/components/navbar"
import FAQ from "@/components/faq"
import ProductReviews from "@/components/product-reviews"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  // Get product ratings and reviews from data
  const productRatings = getProductRatings(params.id)
  const productReviews = getProductReviews(params.id)

  const { getQuantity, increment, decrement } = useProductQuantityStore()
  const quantity = getQuantity(params.id)
  const { addItem } = useShoppingCartStore()

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price)

  const handleAddToCart = () => {
    addItem(product, quantity)
    router.push("/cart")
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main className="pt-[180px] px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square overflow-hidden rounded-lg">
              <Image
                src={product.image || "/placeholder.svg?height=600&width=600&query=emerald+necklace"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative w-24 h-24 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={product.image || "/placeholder.svg?height=100&width=100&query=emerald+necklace"}
                    alt={`${product.name} view ${i}`}
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
              <p className="text-[#1a1a1a] mt-1">Model number: 123456</p>
            </div>

            <div>
              <p className="text-3xl font-medium text-[#1a1a1a]">{formattedPrice}</p>
            </div>

            <p className="text-[#1a1a1a] leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>

            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#f8bf3e] text-[#f8bf3e]" />
              ))}
              <span className="ml-2 text-[#1a1a1a]">({productRatings.totalReviews} Reviews)</span>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-[#1a1a1a]">Quantity</p>
              <div className="flex items-center">
                <button
                  className="w-10 h-10 flex items-center justify-center border border-[#1a1a1a] rounded-l-md"
                  onClick={() => decrement(params.id)}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 h-10 flex items-center justify-center border-t border-b border-[#1a1a1a]">
                  {quantity}
                </div>
                <button
                  className="w-10 h-10 flex items-center justify-center border border-[#1a1a1a] rounded-r-md"
                  onClick={() => increment(params.id)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-3 px-4 border border-[#1a1a1a] rounded-md text-[#1a1a1a] font-medium">
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
                  placeholder="Enter Pin code"
                  className="flex-1 px-4 py-2 border border-[#cccccc] rounded-l-md focus:outline-none"
                />
                <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-r-md">Check</button>
              </div>
              <p className="text-sm text-[#1a1a1a]">Please enter PIN code to check delivery time.</p>
            </div>

            <div className="pt-4 border-t border-[#cccccc]">
              <button className="flex w-full justify-between items-center text-[#1a1a1a] font-medium">
                <span>Product Details</span>
                <ChevronDown className="w-5 h-5" />
              </button>

              <div className="mt-4 space-y-2 text-[#1a1a1a]">
                <p>
                  <span className="font-medium">Material:</span> Emerald, Diamond and Platinum
                </p>
                <p>
                  <span className="font-medium">Occasion:</span> Wedding and Formal
                </p>
                <p>
                  <span className="font-medium">Shop for:</span> Woman
                </p>
                <p>
                  <span className="font-medium">Product weight:</span> 200g
                </p>
                <p>
                  <span className="font-medium">Occasion:</span> Wedding and Formal
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
