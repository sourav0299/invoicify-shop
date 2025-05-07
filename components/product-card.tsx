import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  isFavorite?: boolean
}

export default function ProductCard({ id, name, price, image, isFavorite = false }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)

  return (
    <div className="group relative w-[384px] h-[288px] flex flex-col">
      <div className="relative flex-1 overflow-hidden rounded-[16px] bg-[#f9f9f9]">
        <Link href={`/product/${id}`}>
          <div className="h-[220px] w-full overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={name}
              width={384}
              height={220}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        <button
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-[#f5f5f5]"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-[#1a1a1a] text-[#1a1a1a]" : "text-[#1a1a1a]"}`} />
        </button>
      </div>

      <div className="py-2 space-y-1">
        <Link href={`/product/${id}`} className="block">
          <h3 className="text-base font-medium text-[#1a1a1a] transition-colors hover:text-[#666666] truncate">
            {name}
          </h3>
        </Link>
        <p className="text-base font-medium text-[#1a1a1a]">{formattedPrice}</p>
      </div>
    </div>
  )
}
