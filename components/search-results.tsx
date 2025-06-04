"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

interface SearchResultsProps {
  query: string
  isVisible: boolean
  onClose: () => void
  textColor: string
}

export default function SearchResults({ query, isVisible, onClose, textColor }: SearchResultsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim() || !isVisible) {
      setProducts([])
      return
    }

    const searchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [query, isVisible])

  if (!isVisible) return null

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-[100]">
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
          <span className="ml-2 text-sm text-gray-500">Searching...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="py-2">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 relative flex-shrink-0">
                <Image
                  src={product.image || "/placeholder.svg?height=48&width=48"}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                <p className="text-xs text-gray-500 truncate">{product.category}</p>
                <p className="text-sm font-semibold text-gray-900">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : query.trim() ? (
        <div className="p-4 text-center text-sm text-gray-500">No products found for "{query}"</div>
      ) : null}
    </div>
  )
}
