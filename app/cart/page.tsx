"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bookmark, ChevronRight, Minus, Plus, ShoppingCart, Tag, Trash2, Truck } from "lucide-react"
import { useShoppingCartStore } from "@/lib/store"
import Navbar from "@/components/navbar"
import { getAuth, onAuthStateChanged } from "firebase/auth"

interface CartItem {
  _id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  email: string
  items: CartItem[]
}

export default function CartPage() {
  const router = useRouter()
  const auth = getAuth()
  const user = auth.currentUser;
  const [cartState, setCartState] = useState<CartState>({ email: '', items: [] })
  const [couponInput, setCouponInput] = useState("")
  const [loading, setLoading] = useState(true)
  const { items, couponCode, applyCoupon } =
    useShoppingCartStore()

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim())
      setCouponInput("")
    }
  }

  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setCartState(prev => ({ ...prev, email: user.email as string }))
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const email = user?.email
        if(!email) return
        
        const response = await fetch(`/api/cart?email=${email}`)
        if (!response.ok) throw new Error('Failed to fetch cart')
        
        const data = await response.json()
        setCartState(prev => ({ 
          ...prev, 
          items: Array.isArray(data) ? data : [] 
        }))
      } catch (error) {
        console.error('Error fetching cart:', error)
      } finally {
        setLoading(false)
      }
    }
  
    fetchCart()
  }, [user?.email]) 

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          productId,
          quantity: newQuantity
        })
      })

      if (!response.ok) throw new Error('Failed to update quantity')
      
      const updatedItems = await response.json()
      setCartState(prev => ({ ...prev, items: updatedItems }))
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const removeItem = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          productId,
          quantity: 0
        })
      })

      if (!response.ok) throw new Error('Failed to remove item')
      
      const updatedItems = await response.json()
      setCartState(prev => ({ ...prev, items: updatedItems }))
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  // Calculate totals
  const getSubtotal = () => {
    return cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTax = () => getSubtotal() * 0.18 // 18% tax
  const getDiscount = () => couponInput ? getSubtotal() * 0.1 : 0 // 10% discount
  const getTotal = () => getSubtotal() + getTax() - getDiscount()

  if (cartState.items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="pt-[180px] px-4 md:px-8 lg:px-16 max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-serif mb-4">Your Cart is Empty</h1>
          <p className="mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-[#1a1a1a] text-white rounded-md hover:bg-[#333333] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-[180px] px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        {/* Checkout Steps */}
        <div className="flex justify-center items-center mb-12">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-[#108a07] text-white rounded-full">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="ml-2 font-medium">Cart</span>
          </div>
          <div className="w-24 h-px bg-gray-300 mx-4"></div>
          <div className="flex items-center text-gray-400">
            <div className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span className="ml-2">Address</span>
          </div>
          <div className="w-24 h-px bg-gray-300 mx-4"></div>
          <div className="flex items-center text-gray-400">
            <div className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            <span className="ml-2">Payment</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-3xl font-serif mb-6">Cart</h2>
              <div className="divide-y divide-gray-200">
                {cartState.items.map((item) => (
                  <div key={item.productId} className="py-6 flex flex-col sm:flex-row">
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 mb-4 sm:mb-0">
                      <div className="relative w-full h-full">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </div>
                    <div className="flex-grow sm:ml-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-xl font-medium">{item.name}</h3>
                          <p className="text-gray-600">Model number: 123456</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-gray-700">
                            <Bookmark className="w-5 h-5" />
                          </button>
                          <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center">
                        <Truck className="w-4 h-4 mr-2" />
                        <span className="text-sm">Delivery by 10th May</span>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-lg font-medium">{formatPrice(item.price)}</p>
                        <div className="flex items-center">
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300">
                            {item.quantity}
                          </div>
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-serif mb-6">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <button className="flex w-full justify-between items-center py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    <span>Apply Coupon code</span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>

                {couponCode && (
                  <div className="flex justify-between items-center mt-4 py-3 border-b border-gray-200">
                    <div>
                      <div className="flex items-center">
                        <Tag className="w-5 h-5 mr-2" />
                        <span>Coupon applied {couponCode}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Saved ₹5000 with this coupon</p>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>+{formatPrice(getTax())}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(getDiscount())}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery charges</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-medium">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              <button
                className="w-full py-3 bg-black text-white rounded-md font-medium"
                onClick={() => router.push("/checkout/address")}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
