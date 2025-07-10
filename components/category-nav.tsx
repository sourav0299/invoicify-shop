"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, CircleDollarSign, Diamond, Ear, CircleDot, Watch, Layers, Gift } from "lucide-react"
import { useState } from "react"

export default function CategoryNav() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const textColor = isHomePage ? "text-white" : "text-black"
  const [showDropdown, setShowDropdown] = useState(false)

  const categories = [
    { name: "All jewelry", href: "/shop", icon: LayoutGrid },
    { name: "Gold", href: "/shop", icon: CircleDollarSign },
    { name: "Diamond", href: "/shop", icon: Diamond },
    { name: "Earrings", href: "/shop", icon: Ear },
    { name: "Rings", href: "/shop", icon: CircleDot },
    { name: "Daily wear", href: "/shop", icon: Watch },
    { name: "Collections", href: "/shop", icon: Layers, hasDropdown: true },
    { name: "Gifting", href: "/shop", icon: Gift },
  ]

  const dropdownCategories = [
    [
      { name: "Diamond ring", color: "#FFB6C1", href: "/shop/diamond-ring" },
      { name: "Silver ring", color: "#C0C0C0", href: "/shop/silver-ring" },
      { name: "Nose Pin", color: "#F4A460", href: "/shop/nose-pin" },
      { name: "Bangles", color: "#2F4F4F", href: "/shop/bangles" },
    ],
    [
      { name: "Mangalsutra", color: "#D2691E", href: "/shop/mangalsutra" },
      { name: "Necklaces", color: "#B0C4DE", href: "/shop/necklaces" },
      { name: "Bracelets", color: "#DEB887", href: "/shop/bracelets" },
      { name: "Chains", color: "#4682B4", href: "/shop/chains" },
    ],
    [
      { name: "Pendants", color: "#2F4F4F", href: "/shop/pendants" },
      { name: "Silver ring", color: "#C0C0C0", href: "/shop/silver-ring" },
      { name: "Earring", color: "#CD853F", href: "/shop/earring" },
      { name: "Jhumka", color: "#2F4F4F", href: "/shop/jhumka" },
    ],
    [
      { name: "Diamond ring", color: "#FFB6C1", href: "/shop/diamond-ring" },
      { name: "Silver ring", color: "#C0C0C0", href: "/shop/silver-ring" },
      { name: "Gold ring", color: "#FFD700", href: "/shop/gold-ring" },
      { name: "Ruby ring", color: "#DC143C", href: "/shop/ruby-ring" },
    ],
  ]

  return (
    <div className="fixed top-[88px] left-0 right-0 z-40 bg-transparent">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="flex items-center justify-center py-4">
          <ul className="flex items-center justify-between gap-4 lg:gap-8 w-full max-w-6xl">
            {categories.map((category) => (
              <li key={category.name} className="flex items-center">
                {category.hasDropdown ? (
                  <div
                    className="relative group"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <Link
                      href={category.href}
                      className={`flex items-center gap-2 hover:opacity-70 transition-opacity ${textColor} whitespace-nowrap`}
                    >
                      <category.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </Link>

                    {/* Dropdown with extended hover area */}
                    <div className={`${showDropdown ? "block" : "hidden"}`}>
                      {/* Extended hover area that covers the gap */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen h-6 bg-transparent z-40" />

                      {/* Main dropdown */}
                      <div
                        className="fixed left-1/2 transform -translate-x-1/2 z-50"
                        style={{ top: "calc(88px + 56px + 24px)" }}
                      >
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-[100vw] max-w-6xl">
                          <div className="flex flex-col lg:flex-row">
                            {/* Categories Grid */}
                            <div className="flex-1 p-6 lg:p-8">
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
                                {dropdownCategories.map((column, columnIndex) => (
                                  <div key={columnIndex} className="space-y-4 lg:space-y-6">
                                    {column.map((item) => (
                                      <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-md transition-colors group"
                                      >
                                        <div
                                          className="w-5 h-5 rounded-full flex-shrink-0"
                                          style={{ backgroundColor: item.color }}
                                        ></div>
                                        <span className="text-sm font-normal text-gray-700 group-hover:text-gray-900">
                                          {item.name}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Promotional Section */}
                            <div className="w-full lg:w-72 bg-gray-50 p-6 flex flex-col justify-between">
                              <div className="relative z-10">
                                <div className="mb-4">
                                  <div className="w-full h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-300 to-amber-400 rounded-full opacity-60"></div>
                                    <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-40"></div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                  A eternal symbol of commitment, destined to adorn two soulmates.
                                </p>
                                <button className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm border border-gray-200">
                                  Shop now
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={category.href}
                    className={`flex items-center gap-2 hover:opacity-70 transition-opacity ${textColor} whitespace-nowrap`}
                  >
                    <category.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
