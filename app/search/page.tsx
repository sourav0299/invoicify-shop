"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const searchProducts = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setProducts([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/products?q=${encodeURIComponent(searchQuery)}`)
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

  useEffect(() => {
    if (initialQuery) {
      searchProducts(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchProducts(query)
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-[180px]">
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Searching...</span>
          </div>
        ) : products.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Search Results for "{query}" ({products.length} found)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square relative">
                      <Image
                        src={product.image || "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{product.category}</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No products found</h2>
            <p className="text-gray-500">No products found for "{query}". Try searching with different keywords.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Search Products</h2>
            <p className="text-gray-500">Enter a search term to find products.</p>
          </div>
        )}
      </div>
    </div>
  )
}
