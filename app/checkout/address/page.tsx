"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Home, Building2, Key, Currency } from "lucide-react"
import { useShoppingCartStore, useAddressStore, type Address } from "@/lib/store"
import Navbar from "@/components/navbar"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import toast from "react-hot-toast"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

declare global{
  interface Window{
    Razorpay: any;
  }
}


interface UserResponse {
  _id: string
  email: string
  name: string
  phone: string
  address: Array<{
    _id: string
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    isDefault: boolean
  }>
  isComplete: boolean
  createdAt: string
}

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartTotals {
  subtotal: number
  tax: number
  discount: number
  total: number
}

export default function AddressPage() {
  const router = useRouter()
  const auth = getAuth()
  const user = auth.currentUser
  const { items, getSubtotal, getTax, getDiscount, getTotal, clearCart } = useShoppingCartStore()
  const [addresses, setAddresses] = useState<UserResponse['address']>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')
  // const { addresses, selectedAddressId, selectAddress, removeAddress } = useAddressStore()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pop, setPop] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartTotals, setCartTotals] = useState<CartTotals>({
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
  })

  const calculateTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0)
    const tax = Math.round(subtotal * 0.18)
    const discount = 0
    const total = subtotal + tax - discount

    return { subtotal, tax, discount, total }
  }

  const fetchCartItems = async (email: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cart?email=${email}`)
      if (!response.ok) throw new Error("Failed to fetch cart")
      
      const items: CartItem[] = await response.json()
      if (!items.length) {
        router.push('/shop')
        toast.error("Your cart is empty")
        return
      }

      setCartItems(items)
      setCartTotals(calculateTotals(items))
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast.error("Failed to fetch cart items")
    } finally {
      setLoading(false)
    }
  }

  const fetchAddresses = async (email : string ) => {
    try{
      const response = await fetch(`/api/users/${email}`)
      if(!response.ok){
        throw new Error("Failed to fetch addresses")
      }

      const data : UserResponse = await response.json()
      if(data.address?.length){
        setAddresses(data.address)
        setSelectedAddressId(data.address[0]._id)
      }
    }catch(error){
      console.error("Error in fetching addresses", error);
      toast.error("Failed to fetch")
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        fetchAddresses(user.email)
        fetchCartItems(user.email)
      } else {
        router.push('/login')
      }})

      return () => unsubscribe()
  }, [auth, router])

  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleContinue = async(amount: number) => {
    try{
      if(!user?.email){
        toast.error('Please Login to continue')
        router.push('/login')
        return
      }

      const amountInPaise = Math.round(amount)

      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({amount: amountInPaise})
      });

      const orderData = await orderResponse.json();

      if(!orderResponse.ok){
        throw new Error(orderData.error || 'Failed to create order');
      }

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Shop.Invoicify',
        description: `Payment for ${amount}`,
        image: '/logo.png',
        handler: async function (response: any){
          const orderResponse = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userEmail: user?.email,
              amount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            })
          });
          const orderData = await orderResponse.json()

          if(!orderResponse.ok){
            throw new Error("Payment Failed", orderData.error)
          }
        },
        prefil: {
          email: user?.email,
          name: user.displayName
        },
        theme: {
          color: '#1eb386'
        },
      })
      razorpay.open()
      toast.success("Order Executed Successfully")
          setOrderPlaced(true)
          setPop(true)
          setTimeout(() => {
            clearCart()
          router.push("/shop")
          }, 9000)
    }catch(error){
      console.error("Something went wrong", error)
      toast.error("Try again later")
    }
  }

  const handleRemoveAddress = async(address: any) => {
    const email = user?.email
    if(!email) return
    try{
      const response = await fetch(`/api/users/${email}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: addresses.filter(a => a._id !== address._id)
        })
      })
      if(response.ok){
        setAddresses(prev => prev.filter(a => a._id !== address._id))
      }
      toast.success("Address Removed")
    }catch(error){
      console.error('Error removing address: ', error)
    }
  }

  const handleEdit = (id: string) => {
    setEditingAddressId(id)
    setShowAddressForm(true)
  }

  const { width, height} = useWindowSize()

  const formatDeliveryDate = (date: Date) => {
    return date.getDate() + (date.getDate() === 1 ? 'st' : date.getDate() === 2 ? 'nd' : date.getDate() === 3 ? 'rd' : 'th') + ' ' + 
      date.toLocaleString('default', { month: 'short' })
  }
  const Day = 1*24*60*60*1000

  const FastestDeliveryDate = formatDeliveryDate(new Date(Date.now() + (7 * Day)));
  const SlowestDeliveryDate = formatDeliveryDate(new Date(Date.now() + (14 * Day)));

  if (orderPlaced) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        {pop && <Confetti width={width} height={height} />}
        <div className="pt-[180px] px-4 md:px-8 lg:px-16 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#108a07]"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 className="text-3xl font-serif mb-4">Order Confirmed!</h1>
          <p className="text-lg mb-2">Thank you for your purchase.</p>
          <p className="text-gray-600 mb-8">Your order has been placed and is being processed.</p>
          <p className="text-gray-600">Redirecting to shop page...</p>
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
          <div className="flex items-center text-gray-400">
            <div className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="ml-2">Cart</span>
          </div>
          <div className="w-24 h-px bg-gray-300 mx-4"></div>
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-[#108a07] text-white rounded-full">
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
            <span className="ml-2 font-medium">Address</span>
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
          {/* Address Selection */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-serif">Select Delivery address</h2>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-[#1a1a1a] hover:bg-gray-50"
                  onClick={() => {
                    setEditingAddressId(null)
                    setShowAddressForm(true)
                  }}
                >
                  Add new address
                </button>
              </div>

              {showAddressForm ? (
                <AddressForm
                  editingAddressId={editingAddressId}
                  addresses={addresses}
                  onAddressUpdate={fetchAddresses}
                  onCancel={() => {
                    setShowAddressForm(false)
                    setEditingAddressId(null)
                  }}
                />
              ) : (
                <div className="space-y-6">
                  {addresses.map((address) => (
                    <div key={address._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start">
                        <div className="flex items-center h-5 mt-1">
                          <input
                            id={`address-${address._id}`}
                            name="address"
                            type="radio"
                            className="h-4 w-4 text-[#108a07] border-gray-300 focus:ring-[#108a07]"
                            checked={selectedAddressId === address._id}
                            onChange={() => setSelectedAddressId(address._id)}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`address-${address._id}`} className="font-medium text-gray-900 text-lg">
                            {address.name || 'Home'}
                          </label>
                          <div className="mt-2 text-gray-700">
                            <p>
                              {address.street} {address.city}, {address.state} {address.zipCode}
                            </p>
                          </div>
                          {selectedAddressId === address._id && (
                            <div className="mt-4 flex space-x-4">
                              <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-[#1a1a1a] hover:bg-gray-50"
                                onClick={() => handleRemoveAddress(address)}
                              >
                                Remove
                              </button>
                              <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-[#1a1a1a] hover:bg-gray-50"
                                onClick={() => handleEdit(address._id)}
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 w-[500px]">
              <h2 className="text-2xl font-serif mb-6">Delivery estimates</h2>

              <div className="border-b border-gray-200 pb-4">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center py-2">
              <div className="w-12 h-12 relative mr-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                <p className="text-gray-700 text-sm">
                  Estimated Delivery by <strong>{FastestDeliveryDate}</strong> to <strong>{SlowestDeliveryDate}</strong>
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

              <div className="py-4 space-y-3 border-b border-gray-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>+{formatPrice(cartTotals.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery charges</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="pt-4 mb-6">
                <div className="flex justify-between text-xl font-medium">
                  <span>Total</span>
                  <span>{formatPrice(cartTotals.total)}</span>
                </div>
              </div>

              <button
                className="w-full py-3 bg-black text-white rounded-md font-medium"
                onClick={() => handleContinue((cartTotals.total)*100)}
                disabled={!selectedAddressId || cartItems.length === 0}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface AddressFormProps {
  editingAddressId: string | null
  onCancel: () => void
  addresses: UserResponse['address']
  onAddressUpdate: (email: string) => Promise<void>
}

function AddressForm({ editingAddressId, onCancel, addresses, onAddressUpdate }: AddressFormProps) {
  const auth = getAuth()
  const editingAddress = editingAddressId 
    ? addresses.find(addr => addr._id === editingAddressId) 
    : null

  const [formData, setFormData] = useState({
    name: editingAddress?.name || 'Home',
    street: editingAddress?.street || '',
    city: editingAddress?.city || '',
    state: editingAddress?.state || '',
    zipCode: editingAddress?.zipCode || '',
    isDefault: editingAddress?.isDefault || false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser?.email) return

    try {

      const userResponse = await fetch(`/api/users/${auth.currentUser.email}`)
      const userData = await userResponse.json()

      const newAddress = {
        ...formData,
        name: formData.name.trim() || 'Home',
        _id: editingAddressId || Date.now().toString(),
        isDefault: false
      }

      const updatedAddresses = editingAddressId
        ? addresses.map(addr => 
            addr._id === editingAddressId 
              ? newAddress
              : addr
          )
        : [...addresses, newAddress]

      const response = await fetch(`/api/users/${auth.currentUser.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          address: updatedAddresses,
          isComplete: userData.isComplete
        }),
      })

      if (!response.ok){
        const error = await response.json()
        throw new Error('Failed to save address', error.error)
      }

      await onAddressUpdate(auth.currentUser.email)
      onCancel()
      toast.success(editingAddressId ? 'Address updated' : 'Address added')
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Failed to save address')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-gray-500">(Optional)</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Home, Office, etc."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108a07]"
        />
      </div>

      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108a07]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108a07]"
          />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108a07]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
          ZIP Code
        </label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleChange}
          required
          pattern="[0-9]{6}"
          maxLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108a07]"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-[#108a07] text-white rounded-md hover:bg-[#0c7206]"
        >
          {editingAddressId ? "Update Address" : "Save Address"}
        </button>
      </div>
    </form>
  )
}
