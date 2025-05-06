import type React from "react"
import Image from "next/image"
import Link from "next/link"

interface BestSellerItemProps {
  imageSrc: string
  alt: string
  href: string
  className?: string
  style?: React.CSSProperties
}

const BestSellerItem = ({ imageSrc, alt, href, className, style }: BestSellerItemProps) => {
  return (
    <Link href={href} className={`block rounded-2xl overflow-hidden ${className}`} style={style}>
      <div className="relative w-full h-full">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 384px"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </Link>
  )
}

export default function BestSellers() {
  return (
    <section className="py-16 px-4 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[#1a1a1a] text-5xl md:text-6xl font-serif mb-4">Best sellers</h2>
          <p className="text-[#1a1a1a] text-lg max-w-3xl mx-auto">
            Whether casual or formal, find the perfect jewelry for every occasion with us.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6">
          
          <div className="flex flex-col gap-6" style={{ width: "100%", maxWidth: "384px" }}>
            <BestSellerItem
              imageSrc="/bestseller/bestseller-1.png"
              alt="Diamond eternity ring"
              href="/product/eternity-ring"
              style={{ height: "288px" }}
            />
            <BestSellerItem
              imageSrc="/bestseller/bestseller-2.png"
              alt="Diamond stud earrings"
              href="/product/diamond-studs"
              style={{ height: "288px" }}
            />
          </div>

         
          <div className="flex flex-col gap-6" style={{ width: "100%", maxWidth: "384px" }}>
            <BestSellerItem
              imageSrc="/bestseller/bestseller-3.png"
              alt="Crystal pendant necklace"
              href="/product/crystal-pendant"
              style={{ height: "384px" }}
            />
            <BestSellerItem
              imageSrc="/bestseller/bestseller-4.png"
              alt="Rose gold pink gemstone ring"
              href="/product/pink-gemstone-ring"
              style={{ height: "192px" }}
            />
          </div>

          
          <div className="flex flex-col gap-6" style={{ width: "100%", maxWidth: "384px" }}>
            <BestSellerItem
              imageSrc="/bestseller/bestseller-5.png"
              alt="Stacked gold rings"
              href="/product/stacked-rings"
              style={{ height: "288px" }}
            />
            <BestSellerItem
              imageSrc="/bestseller/bestseller-6.png"
              alt="Gold engraved ring"
              href="/product/engraved-ring"
              style={{ height: "288px" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
