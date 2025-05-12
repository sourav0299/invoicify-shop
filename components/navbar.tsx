"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Search, User, Menu, Mic, Heart, UserRound, Box, Tags, CircleHelp, LogOut, X } from "lucide-react"
import CartCounter from "@/components/cart-counter"
import CategoryNav from "./category-nav"
import { useEffect, useState, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { debounce } from "@/lib/debounce"

// Add this at the top of the file, after the imports
declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const isHomePage = pathname === "/"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([])
      setShowResults(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      // Use the enhanced API with search parameter
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`)
      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()

      
      const products = Array.isArray(data) ? data : data.products || []

      setSearchResults(products)
      setShowResults(true)
    } catch (error) {
      console.error("Error searching products:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, 300)

  // Update search query and trigger debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
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
      debouncedSearch(transcript)
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

  // Navigate to product page and clear search
  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
    setShowResults(false)
    setSearchQuery("")
  }

  // Navigate to search results page
  const handleViewAllResults = () => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    setShowResults(false)
  }


  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
  }

  
  const textColor = isHomePage ? "text-white" : "text-black"
  const borderColor = isHomePage ? "border-white/30" : "border-black/30"
  const placeholderColor = isHomePage ? "placeholder:text-white/50" : "placeholder:text-black/50"

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-10 px-16 py-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Nayra Jewels Logo" width={30} height={30} />
            </Link>

            <Link href="/" className="flex items-center">
              <Image
                src="/Nayra Jewels.png"
                alt="Nayra Jewels Logo"
                width={120}
                height={40}
                className="h-auto w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center" ref={searchRef}>
              <div className={`relative flex items-center rounded-md border ${borderColor} bg-transparent px-3 py-1.5`}>
                <Search className={`h-4 w-4 ${textColor}/70 mr-2`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`bg-transparent text-sm ${textColor} outline-none ${placeholderColor} w-40`}
                />
                {searchQuery && (
                  <button
                    aria-label="Clear search"
                    onClick={clearSearch}
                    className={`ml-1 ${textColor}/70 hover:${textColor} transition-colors`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  aria-label="Voice search"
                  onClick={startVoiceSearch}
                  className={`ml-1 ${textColor}/70 hover:${textColor} transition-colors ${isListening ? "animate-pulse text-red-500" : ""}`}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
                  <div className="p-2">
                    {isSearching ? (
                      <p className="text-sm text-gray-500 py-2 text-center">Searching...</p>
                    ) : searchResults.length > 0 ? (
                      <>
                        <p className="text-sm text-gray-500 mb-2">Search Results</p>
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                          >
                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                              <Image
                                src={product.image || "/placeholder.svg?height=100&width=100&query=jewelry"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.category}</p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 0,
                              }).format(product.price)}
                            </p>
                          </div>
                        ))}
                        {searchResults.length >= 5 && (
                          <button
                            onClick={handleViewAllResults}
                            className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-50 rounded-md mt-1"
                          >
                            View all results
                          </button>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 py-2 text-center">No results found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button aria-label="Search" onClick={() => router.push("/search")} className={`md:hidden p-2 ${textColor}`}>
              <Search className="h-5 w-5" />
            </button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  onClick={() => router.push("/profile")}
                  aria-label="Profile"
                  className={`p-2 ${textColor}`}
                >
                  {user?.photoURL ? (
                    <Image
                      width={30}
                      height={30}
                      src={user.photoURL || "/placeholder.svg"}
                      alt="Profile"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <UserRound className="h-5 w-5" />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserRound className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <Box className="h-4 w-4 mr-2" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <Tags className="h-4 w-4 mr-2" />
                    My Coupons
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/contact-us")}>
                    <CircleHelp className="h-4 w-4 mr-2" />
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut(auth)}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button onClick={() => router.push("/login")} aria-label="Account" className={`p-2 ${textColor}`}>
                <User className="h-5 w-5" />
              </button>
            )}
            <button aria-label="Wishlist" className={`p-2 ${textColor}`} onClick={() => router.push("/wishlist")}>
              <Heart className="h-5 w-5" />
            </button>
            <CartCounter isHomePage={isHomePage} />
            <button aria-label="Menu" className={`md:hidden p-2 ${textColor}`}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
      <CategoryNav />
    </>
  )
}
