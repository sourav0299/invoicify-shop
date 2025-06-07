"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Search, User, Menu, Mic, Heart, UserRound, Box, Tags, CircleHelp, LogOut, X } from "lucide-react"
import CartCounter from "@/components/cart-counter"
import CategoryNav from "./category-nav"
import SearchResults from "./search-results"
import { useEffect, useState, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useDebounce } from "@/hooks/use-debounce"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Speech Recognition interfaces
interface SpeechRecognitionResult {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult[]
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
}

// Define the constructor type
type SpeechRecognitionConstructor = new () => SpeechRecognition

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Debounce search query with 300ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const isHomePage = pathname === "/"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  // Handle clicks outside search to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Show search results when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setShowSearchResults(true)
    }
  }, [debouncedSearchQuery])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get the appropriate speech recognition constructor
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognitionAPI) {
        try {
          const recognitionInstance = new SpeechRecognitionAPI()

          recognitionInstance.continuous = false
          recognitionInstance.interimResults = false
          recognitionInstance.lang = "en-US"

          recognitionInstance.onstart = () => {
            setIsListening(true)
          }

          recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript
            setSearchQuery(transcript)
            setIsListening(false)
          }

          recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error("Speech recognition error:", event.error)
            setIsListening(false)
          }

          recognitionInstance.onend = () => {
            setIsListening(false)
          }

          setRecognition(recognitionInstance)
        } catch (error) {
          console.error("Error initializing speech recognition:", error)
        }
      }
    }
  }, [])

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setShowSearchResults(true)
    }
  }

  const handleSearchClear = () => {
    setSearchQuery("")
    setShowSearchResults(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
    }
  }

  const handleVoiceSearch = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser")
      return
    }

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  // Set text color based on current page
  const textColor = isHomePage ? "text-white" : "text-black"
  const borderColor = isHomePage ? "border-white/30" : "border-black/30"
  const placeholderColor = isHomePage ? "placeholder:text-white/50" : "placeholder:text-black/50"

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-40 px-16 py-6">
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
              <form onSubmit={handleSearchSubmit} className="relative">
                <div
                  className={`relative flex items-center rounded-md border ${borderColor} bg-transparent px-3 py-1.5`}
                >
                  <Search className={`h-4 w-4 ${textColor}/70 mr-2`} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    className={`bg-transparent text-sm ${textColor} outline-none ${placeholderColor} w-40`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleSearchClear}
                      className={`ml-1 ${textColor}/70 hover:${textColor} transition-colors`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    aria-label={isListening ? "Stop voice search" : "Start voice search"}
                    className={`ml-1 ${textColor}/70 hover:${textColor} transition-colors ${isListening ? "animate-pulse text-red-500" : ""}`}
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
              </form>

              <SearchResults
                query={debouncedSearchQuery}
                isVisible={showSearchResults}
                onClose={() => setShowSearchResults(false)}
                textColor={textColor}
              />
            </div>

            <button aria-label="Search" className={`md:hidden p-2 ${textColor}`} onClick={() => router.push("/search")}>
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger aria-label="Profile" className={`p-2 ${textColor}`}>
                  <Image
                    width={30}
                    height={30}
                    src={user?.photoURL || "/placeholder.svg?height=30&width=30"}
                    alt="Profile"
                    className="rounded-full object-cover"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuLabel>{user.displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserRound className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/orders")}>
                    <Box className="mr-2 h-4 w-4" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/coupons")}>
                    <Tags className="mr-2 h-4 w-4" />
                    My Coupons
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/contact-us")}>
                    <CircleHelp className="mr-2 h-4 w-4" />
                    Help
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut(auth)}>
                    <LogOut className="mr-2 h-4 w-4" />
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
