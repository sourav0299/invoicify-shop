import Link from "next/link"
import Image from "next/image"

interface ProductProps {
  title: string
  price: string
  imageSrc: string
  href: string
}

const Product = ({ title, price, imageSrc, href }: ProductProps) => {
  return (
    <div className="flex flex-col">
      <Link href={href} className="overflow-hidden rounded-2xl mb-4">
        <div className="relative w-full" style={{ width: '384px', height: '288px', maxWidth: '100%' }}>
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      </Link>
      <h3 className="text-[#1a1a1a] text-xl font-serif">{title}</h3>
      <p className="text-[#1a1a1a] text-sm">₹{price}</p>
    </div>
  )
}

export default function CollectionGrid() {
  const products = [
    {
      id: 1,
      title: "Charming necklace",
      price: "80,000",
      imageSrc: "/collections/jewel-1.png",
      href: "/product/1",
    },
    {
      id: 2,
      title: "Charming necklace",
      price: "80,000",
      imageSrc: "/collections/jewel-2.png",
      href: "/product/2",
    },
    {
      id: 3,
      title: "Charming necklace",
      price: "80,000",
      imageSrc: "/collections/jewel-3.png",
      href: "/product/3",
    },
    {
      id: 4,
      title: "Charming necklace",
      price: "80,000",
      imageSrc: "/collections/jewel-4.png",
      href: "/product/4",
    },
    {
      id: 5,
      title: "Charming necklace",
      price: "80,000",
      imageSrc: "/collections/jewel-5.png",
      href: "/product/5",
    },
    {
      id: 6,
      title: "Charming necklace",
      price: "80,000",
      imageSrc: "/collections/jewel-6.png",
      href: "/product/6",
    },
  ]

  return (
    <section className="py-16 px-4 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[#1a1a1a] text-5xl md:text-6xl font-serif mb-4">New collection</h2>
          <p className="text-[#1a1a1a] text-lg max-w-3xl mx-auto">
            Whether casual or formal, find the perfect jewelry for every occasion with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product) => (
            <Product
              key={product.id}
              title={product.title}
              price={product.price}
              imageSrc={product.imageSrc}
              href={product.href}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
