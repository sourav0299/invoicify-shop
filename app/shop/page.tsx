"use client"

import type React from "react"

import ProductCard from "@/components/product-card"
import { useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"

interface Product {
  id: string
  name: string
  price: number
  image: string
  isFavorite: boolean
  category?: string
  occasion?: string
  material?: string
  purity?: string
  description?: string
  [key: string]: any
}


interface WindowWithFilters extends Window {
  filterByCategory?: (category: string) => void
}


declare const window: WindowWithFilters

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    product: true,
    occasion: true,
    material: true,
    price: true,
    purity: true,
  })


  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedPurities, setSelectedPurities] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState(200000)

  // Product categories for the shop page filters
  const productCategories = ["Bangles", "Necklace", "Chain", "Bracelets", "Rings", "Earrings"]
  const occasionCategories = ["Casual", "Formal", "Modern", "Engagement", "Wedding", "Traditional and ethnic"]
  const materialCategories = ["Gold", "Diamond", "Silver", "Platinum"]
  const purityCategories = ["14", "18", "24", "95"]

  useEffect(() => {
    fetchProducts()

    
    window.filterByCategory = (category: string) => {
      if (category) {
        setSelectedCategories([category])
      } else {
        setSelectedCategories([])
      }

   
      setTimeout(() => {
        applyFilters()
      }, 0)
    }

   
    return () => {
      if (window.filterByCategory) {
        delete window.filterByCategory
      }
    }
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()

      
      const productArray = Array.isArray(data) ? data : data.products || []

      setProducts(productArray)
      setFilteredProducts(productArray)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    })
  }


  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }


  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions((prev) => {
      if (prev.includes(occasion)) {
        return prev.filter((o) => o !== occasion)
      } else {
        return [...prev, occasion]
      }
    })
  }


  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) => {
      if (prev.includes(material)) {
        return prev.filter((m) => m !== material)
      } else {
        return [...prev, material]
      }
    })
  }

  // Toggle purity selection
  const togglePurity = (purity: string) => {
    setSelectedPurities((prev) => {
      if (prev.includes(purity)) {
        return prev.filter((p) => p !== purity)
      } else {
        return [...prev, purity]
      }
    })
  }

  // Handle price range change with debounce
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number.parseInt(e.target.value)
    setPriceRange(newPrice)
  }

  // Check if a product matches a filter value
  const matchesFilter = (productValue: string | undefined, filterValues: string[]): boolean => {
    if (!filterValues.length) return true 
    if (!productValue) return false 


    return filterValues.some((filter) => productValue.toLowerCase().includes(filter.toLowerCase()))
  }

 
  const applyFilters = () => {
    setLoading(true)

    const filtered = products.filter((product) => {
     
      if (product.price > priceRange) {
        return false
      }

      // Apply category filter if any categories are selected
      if (selectedCategories.length > 0) {
        if (
          !product.category ||
          !selectedCategories.some((cat) => product.category?.toLowerCase().includes(cat.toLowerCase()))
        ) {
          return false
        }
      }

   
      if (selectedOccasions.length > 0) {
        if (
          !product.occasion ||
          !selectedOccasions.some((occ) => product.occasion?.toLowerCase().includes(occ.toLowerCase()))
        ) {
          return false
        }
      }

      
      if (selectedMaterials.length > 0) {
        if (
          !product.material ||
          !selectedMaterials.some((mat) => product.material?.toLowerCase().includes(mat.toLowerCase()))
        ) {
          return false
        }
      }

    
      if (selectedPurities.length > 0) {
        if (!product.purity || !selectedPurities.includes(product.purity)) {
          return false
        }
      }

      return true
    })

    setFilteredProducts(filtered)
    setLoading(false)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedOccasions([])
    setSelectedMaterials([])
    setSelectedPurities([])
    setPriceRange(200000)
    setFilteredProducts(products)
  }

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="w-full max-w-[1440px] mx-auto pt-[180px] px-4 sm:px-6 lg:px-[112px] pb-[96px]">
        <div className="flex flex-col lg:flex-row gap-[48px]">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-[368px]">
            <div className="border border-[#cccccc] rounded-[20px] p-[24px]">
              <div className="flex justify-between items-center mb-[24px]">
                <h2 className="text-xl font-medium text-[#1a1a1a]">Filters</h2>
                <button className="text-[#1a1a1a]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Product Filter */}
              <div className="py-4 border-t border-[#cccccc]">
                <div
                  className="flex justify-between items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection("product")}
                >
                  <h3 className="text-base font-medium text-[#1a1a1a]">Product</h3>
                  {expandedSections.product ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {expandedSections.product && (
                  <div className="flex flex-wrap gap-2">
                    {productCategories.map((category) => (
                      <button
                        key={category}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          selectedCategories.includes(category)
                            ? "bg-[#1a1a1a] text-white"
                            : "bg-[#f5f5f5] text-[#1a1a1a]"
                        }`}
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Occasion Filter */}
              <div className="py-4 border-t border-[#cccccc]">
                <div
                  className="flex justify-between items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection("occasion")}
                >
                  <h3 className="text-base font-medium text-[#1a1a1a]">Occasion</h3>
                  {expandedSections.occasion ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {expandedSections.occasion && (
                  <div className="flex flex-wrap gap-2">
                    {occasionCategories.map((occasion) => (
                      <button
                        key={occasion}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          selectedOccasions.includes(occasion)
                            ? "bg-[#1a1a1a] text-white"
                            : "bg-[#f5f5f5] text-[#1a1a1a]"
                        }`}
                        onClick={() => toggleOccasion(occasion)}
                      >
                        {occasion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Material Filter */}
              <div className="py-4 border-t border-[#cccccc]">
                <div
                  className="flex justify-between items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection("material")}
                >
                  <h3 className="text-base font-medium text-[#1a1a1a]">Material</h3>
                  {expandedSections.material ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {expandedSections.material && (
                  <div className="flex flex-wrap gap-2">
                    {materialCategories.map((material) => (
                      <button
                        key={material}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          selectedMaterials.includes(material)
                            ? "bg-[#1a1a1a] text-white"
                            : "bg-[#f5f5f5] text-[#1a1a1a]"
                        }`}
                        onClick={() => toggleMaterial(material)}
                      >
                        {material}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="py-4 border-t border-[#cccccc]">
                <div
                  className="flex justify-between items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection("price")}
                >
                  <h3 className="text-base font-medium text-[#1a1a1a]">Price</h3>
                  {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {expandedSections.price && (
                  <>
                    <div className="mb-2">
                      <input
                        type="range"
                        min="50000"
                        max="200000"
                        step="1000"
                        value={priceRange}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-[#1a1a1a]">
                      <span>{formatPrice(50000)}</span>
                      <span>{formatPrice(priceRange)}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">Move slider to adjust maximum price</div>
                  </>
                )}
              </div>

              {/* Purity Filter */}
              <div className="py-4 border-t border-[#cccccc]">
                <div
                  className="flex justify-between items-center mb-3 cursor-pointer"
                  onClick={() => toggleSection("purity")}
                >
                  <h3 className="text-base font-medium text-[#1a1a1a]">Purity</h3>
                  {expandedSections.purity ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {expandedSections.purity && (
                  <div className="flex gap-2">
                    {purityCategories.map((purity) => (
                      <button
                        key={purity}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                          selectedPurities.includes(purity) ? "bg-[#1a1a1a] text-white" : "bg-[#f5f5f5] text-[#1a1a1a]"
                        }`}
                        onClick={() => togglePurity(purity)}
                      >
                        {purity}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 py-3 border border-[#1a1a1a] rounded-md text-[#1a1a1a] font-medium"
                  onClick={clearAllFilters}
                >
                  Clear all
                </button>
                <button className="flex-1 py-3 bg-[#1a1a1a] rounded-md text-white font-medium" onClick={applyFilters}>
                  Apply filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="w-full lg:w-[800px]">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-lg text-gray-500 mb-4">No products match your filters</p>
                <button onClick={clearAllFilters} className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-sm text-gray-500">Showing {filteredProducts.length} products</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Sort by:</span>
                    <select className="border rounded-md px-2 py-1 text-sm">
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-[36px]">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
                      isFavorite={product.isFavorite}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}