"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Search, Mic, ArrowLeft, X, Filter, ChevronDown } from 'lucide-react'
import { debounce } from "@/lib/debounce"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description?: string
}

interface PaginationData {
  total: number
  page: number
  limit: number
  pages: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0
  })
  
  // Filter states
  const [category, setCategory] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  
  const router = useRouter()

  // Fetch products based on search and filters
  const fetchProducts = async (page = 1) => {
    setIsLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      
      if (searchQuery) {
        params.append("search", searchQuery)
      }
      
      if (category) {
        params.append("category", category)
      }
      
      if (minPrice) {
        params.append("minPrice", minPrice)
      }
      
      if (maxPrice) {
        params.append("maxPrice", maxPrice)
      }
      
      params.append("sort", sortBy)
      params.append("order", sortOrder)
      params.append("page", page.toString())
      params.append("limit", "20")
      
      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      
      // Handle both response formats (array or object with products property)
      if (Array.isArray(data)) {
        setSearchResults(data)
        setPagination({
          total: data.length,
          page: 1,
          limit: data.length,
          pages: 1
        })
      } else {
        setSearchResults(data.products || [])
        setPagination(data.pagination || {
          total: data.products?.length || 0,
          page: 1,
          limit: data.products?.length || 0,
          pages: 1
        })
      }
    } catch (error) {
      console.error("Error searching products:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      fetchProducts()
    } else {
      setIsLoading(false)
    }
  }, [initialQuery])

  // Debounced search function
  const debouncedSearch = debounce(() => {
    fetchProducts(1) // Reset to page 1 when search changes
  }, 500)

  // Update search query and trigger debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.trim().length >= 2 || query.trim().length === 0) {
      debouncedSearch()
    }
  }

  // Apply filters
  const applyFilters = () => {
    fetchProducts(1) // Reset to page 1 when filters change
    setShowFilters(false)
  }

  // Reset filters
  const resetFilters = () => {
    setCategory("")
    setMinPrice("")
    setMaxPrice("")
    setSortBy("createdAt")
    setSortOrder("desc")
    fetchProducts(1)
    setShowFilters(false)
  }

  // Handle voice search
  const startVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser")
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: { results: { transcript: any }[][] }) => {
      const transcript = event.results[0][0].transcript
      setSearchQuery(transcript)
      debouncedSearch()
    }

    recognition.onerror = (event: { error: any }) => {
      console.error("Speech recognition error", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  // Navigate to product page
  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    debouncedSearch()
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchProducts(newPage)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex-1 flex items-center border rounded-md px-3 py-2">
            <Search className="h-4 w-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              className="flex-1 outline-none text-sm"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={startVoiceSearch}
              className={`ml-2 text-gray-500 hover:text-gray-700 ${isListening ? "text-red-500 animate-pulse" : ""}`}
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-700 hover:text-gray-900"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
        
      
        {showFilters && (
          <div className="mt-3 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-3">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Categories</option>
                  <option value="necklace">Necklace</option>
                  <option value="earrings">Earrings</option>
                  <option value="rings">Rings</option>
                  <option value="bracelets">Bracelets</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm mb-1">Min Price</label>
                  <input 
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="₹"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Max Price</label>
                  <input 
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="₹"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Sort By</label>
                <div className="flex gap-2">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                  </select>
                  <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-24 p-2 border rounded-md"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={resetFilters}
                  className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  Reset
                </button>
                <button 
                  onClick={applyFilters}
                  className="flex-1 py-2 bg-black text-white rounded-md"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p>Searching...</p>
          </div>
        ) : searchQuery.length < 2 && !category && !minPrice && !maxPrice ? (
          <div className="py-8 text-center text-gray-500">
            <p>Enter at least 2 characters to search or use filters</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No products found for your search criteria</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Showing {searchResults.length} of {pagination.total} results
              </p>
            </div>
            
            <div className="grid gap-4">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg?height=100&width=100&query=jewelry"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
        
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
