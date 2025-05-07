import Link from "next/link"

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
      <p className="text-lg mb-8">The product you're looking for doesn't exist or has been removed.</p>
      <Link href="/shop" className="px-6 py-3 bg-[#1a1a1a] text-white rounded-md hover:bg-[#333333] transition-colors">
        Return to Shop
      </Link>
    </div>
  )
}
