"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, CircleDollarSign, Diamond, Ear, CircleDot, Watch, Layers, Gift } from "lucide-react"

export default function CategoryNav() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const textColor = isHomePage ? "text-white" : "text-black"

  const categories = [
    { name: "All jewelry", href: "/shop", icon: LayoutGrid },
    { name: "Gold", href: "/shop", icon: CircleDollarSign },
    { name: "Diamond", href: "/shop", icon: Diamond },
    { name: "Earrings", href: "/shop", icon: Ear },
    { name: "Rings", href: "/shop", icon: CircleDot },
    { name: "Daily wear", href: "/shop", icon: Watch },
    { name: "Collections", href: "/shop", icon: Layers },
    { name: "Gifting", href: "/shop", icon: Gift },
  ]

  return (
    <div
      className="absolute top-20 left-0 right-0 z-10 mx-auto"
      style={{
        width: "1440px",
        height: "56px",
        paddingTop: "16px",
        paddingRight: "112px",
        paddingBottom: "16px",
        paddingLeft: "112px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <ul
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {categories.map((category) => (
          <li key={category.name} style={{ display: "flex", alignItems: "center" }}>
            <Link
              href={category.href}
              className={`flex items-center gap-2 hover:opacity-70 transition-opacity ${textColor}`}
            >
              <category.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
