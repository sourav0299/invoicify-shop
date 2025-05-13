"use client"

import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface WishlistProduct {
  productId: string
  name: string
  price: number
  image: string
  addedAt: string
}

export default function Wishlist() {
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        router.push('/login');
        toast.error('Please login to view wishlist');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/wishlist?email=${user.email}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to fetch wishlist');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchWishlist();
    }
  }, [user?.email]);

    return (
        <div className="bg-white min-h-screen">
              <Navbar />
        
             
              <div className="w-[1440px] h-[1756px] mx-auto pt-[180px] pr-[112px] pb-[96px] pl-[112px]">
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
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a1a1a]"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 gap-[36px]">
                {products.map((product) => (
                  <ProductCard
                    key={product.productId}
                    id={product.productId}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    isFavorite={true}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <h3 className="text-2xl font-medium mb-4">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-8">Start adding items to your wishlist!</p>
                <button 
                  onClick={() => router.push('/shop')}
                  className="px-6 py-3 bg-[#1a1a1a] text-white rounded-md hover:bg-black transition-colors"
                >
                  Browse Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}