import Navbar from "@/components/navbar"
import ProductCard from "@/components/product-card"
import { products } from "@/data/product"

export default function Shop() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

     
      <div className="w-[1440px] h-[1756px] mx-auto pt-[96px] pr-[112px] pb-[96px] pl-[112px]">
        <div className="flex gap-[48px]">
          
          <div className="w-[368px] h-[944px]">
            <div className="border border-[#cccccc] rounded-[20px] p-[24px]">
              <div className="flex justify-between items-center mb-[24px]">
                <h2 className="text-xl font-medium text-[#1a1a1a]">Filters</h2>
                <button className="text-[#1a1a1a]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              
              <div className="py-4 border-t border-[#cccccc]">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-[#1a1a1a]">Product</h3>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Bangles</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Necklace</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Chain</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Bracelets</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Rings</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Earrings</button>
                </div>
              </div>

              
              <div className="py-4 border-t border-[#cccccc]">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-[#1a1a1a]">Occasion</h3>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Casual</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Formal</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Modern</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Engagement</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Wedding</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Traditional and ethnic</button>
                </div>
              </div>

            
              <div className="py-4 border-t border-[#cccccc]">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-[#1a1a1a]">Material</h3>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Gold</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Platinum</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Silver</button>
                  <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-sm">Diamond</button>
                </div>
              </div>

        
              <div className="py-4 border-t border-[#cccccc]">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-[#1a1a1a]">Price</h3>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="mb-2">
                  <input
                    type="range"
                    min="50000"
                    max="200000"
                    defaultValue="125000"
                    className="w-full h-1 bg-[#cccccc] rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="text-sm text-[#1a1a1a]">₹50,000 - ₹200,000</div>
              </div>

           
              <div className="py-4 border-t border-[#cccccc]">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-medium text-[#1a1a1a]">Purity</h3>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 flex items-center justify-center bg-[#f5f5f5] rounded-full text-sm">
                    14
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#f5f5f5] rounded-full text-sm">
                    18
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#f5f5f5] rounded-full text-sm">
                    24
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center bg-[#f5f5f5] rounded-full text-sm">
                    95
                  </button>
                </div>
              </div>

             
              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-3 border border-[#1a1a1a] rounded-md text-[#1a1a1a] font-medium">
                  Clear all
                </button>
                <button className="flex-1 py-3 bg-[#1a1a1a] rounded-md text-white font-medium">Apply filters</button>
              </div>
            </div>
          </div>

         
          <div className="w-[800px] h-[1564px]">
            <div className="grid grid-cols-2 gap-[36px]">
              {products.map((product) => (
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
          </div>
        </div>
      </div>
    </div>
  )
}