import Image from "next/image"
import Link from "next/link"

export default function FeaturedCollection() {
  return (
    <section className="px-4 py-12 md:py-16">
      <div className="mx-auto" style={{ maxWidth: "1440px" }}>
        <div 
          className="bg-black rounded-[32px] overflow-hidden relative"
          style={{ height: "784px" }}
        >
          {/* Background Image covering the entire card */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/collections/minimal.png"
              alt="Minimal Me Collection - Diamond Ring"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Collection label at bottom left */}
          <div className="absolute bottom-8 left-8">
            <span className="text-xs tracking-widest uppercase text-white/70">Collection</span>
          </div>

          {/* Content Section on right */}
          <div className="absolute right-8 top-[70%] -translate-y-1/2 max-w-xs text-white">
            <h2 className="text-4xl md:text-5xl font-serif font-normal mb-4">Minimal Me</h2>
            <p className="mb-8 text-sm md:text-base opacity-90 leading-relaxed">
              Introducing our new minimalist collection. Suitable for the active yet elegant.
            </p>
            <Link
              href="/collections/minimal-me"
              className="inline-block bg-white text-black px-8 py-3 font-medium hover:bg-gray-200 transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
