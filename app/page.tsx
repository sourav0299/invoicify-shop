import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/navbar"
import CollectionGrid from "@/components/collection-grid"
import FeaturedCollection from "@/components/featured-collection"
import BestSellers from "@/components/best-sellers"

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative h-screen w-full bg-black text-white">
        <Image src="/bg.png" alt="Luxury jewelry collection" fill priority className="object-cover brightness-75" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-40 pointer-events-none"></div>

        <Navbar />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-wide mb-4">
            DISCOVER SPARKLE WITH STYLE
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Whether casual or formal, find the perfect jewelry for every occasion with us.
          </p>
          <Link href="/shop" className="bg-white text-black px-8 py-3 font-medium hover:bg-gray-200 transition-colors">
            SHOP NOW
          </Link>
        </div>
      </section>

      <CollectionGrid />

      <FeaturedCollection />

      <BestSellers />
    </main>
  )
}
