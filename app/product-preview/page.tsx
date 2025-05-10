"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ChevronDown } from "lucide-react"
import { products } from "@/data/product"

export default function ProductPreviewPage() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortOption, setSortOption] = useState("featured")
  const [showSortOptions, setShowSortOptions] = useState(false)


  useEffect(() => {
    const result = [...products]

   
    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortOption === "newest") {
     
      result.sort((a, b) => (b.date ? new Date(b.date).getTime() : 0) - (a.date ? new Date(a.date).getTime() : 0))
    }
   

    setFilteredProducts(result)
  }, [sortOption])

 
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-[180px] px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">Our Collection</h1>

        
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              <span>
                Sort by:{" "}
                {sortOption === "featured"
                  ? "Featured"
                  : sortOption === "price-low"
                    ? "Price: Low to High"
                    : sortOption === "price-high"
                      ? "Price: High to Low"
                      : "Newest"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {showSortOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      sortOption === "featured" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setSortOption("featured")
                      setShowSortOptions(false)
                    }}
                  >
                    Featured
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      sortOption === "price-low" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setSortOption("price-low")
                      setShowSortOptions(false)
                    }}
                  >
                    Price: Low to High
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      sortOption === "price-high" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setSortOption("price-high")
                      setShowSortOptions(false)
                    }}
                  >
                    Price: High to Low
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      sortOption === "newest" ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setSortOption("newest")
                      setShowSortOptions(false)
                    }}
                  >
                    Newest
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
                  <Image
                    src={product.image || "/placeholder.svg?height=400&width=400&query=jewelry"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md"
                    onClick={(e) => {
                      e.preventDefault()
                    
                    }}
                  >
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </Link>
              <div>
                <Link href={`/product/${product.id}`} className="block">
                  <h3 className="text-lg font-medium text-[#1a1a1a] mb-1">{product.name}</h3>
                </Link>
                <p className="text-gray-600 mb-2">{product.category || "Jewelry"}</p>
                <p className="font-medium text-[#1a1a1a]">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
