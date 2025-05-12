"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Shop from "@/app/shop/page"

// This is a wrapper component that redirects to the shop page with the right category
export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  useEffect(() => {
    // Map the slug to the corresponding category in the shop page
    let category = ""
    switch (slug) {
      case "rings":
        category = "All jewelry"
        break
      case "earrings":
        category = "Gold"
        break
      case "necklaces":
        category = "Diamond"
        break
      case "bracelets":
        category = "Earrings"
        break
      case "pendants":
        category = "Rings"
        break
      case "anklets":
        category = "Daily wear"
        break
      case "watches":
        category = "Collections"
        break
      default:
        category = ""
    }

    // Store the category in sessionStorage for the shop page to use
    if (category) {
      sessionStorage.setItem("selectedCategory", category)
    }

    // Redirect to the shop page
    router.push("/shop")
  }, [slug, router])

  // Return the Shop component directly
  return <Shop />
}
