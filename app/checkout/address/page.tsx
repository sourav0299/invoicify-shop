"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Home, Building2 } from "lucide-react"
import { useShoppingCartStore, useAddressStore, type Address } from "@/lib/store"
import Navbar from "@/components/navbar"

export default function AddressPage() {
  const router = useRouter()
  const { items, getSubtotal, getTax, getDiscount, getTotal, clearCart } = useShoppingCartStore()
  const { addresses, selectedAddressId, selectAddress, removeAddress } = useAddressStore()
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [orderPlaced, setOrderPlaced] = useState(false)

  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleContinue = () => {
    if (selectedAddressId) {
     
      setOrderPlaced(true)
      setTimeout(() => {
        clearCart()
        router.push("/shop")
      }, 3000)
    }
  }

  const handleEdit = (id: string) => {
    setEditingAddressId(id)
    setShowAddressForm(true)
  }

  if (orderPlaced) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
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
                  onCancel={() => {
                    setShowAddressForm(false)
                    setEditingAddressId(null)
                  }}
                />
              ) : (
                <div className="space-y-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start">
                        <div className="flex items-center h-5 mt-1">
                          <input
                            id={`address-${address.id}`}
                            name="address"
                            type="radio"
                            className="h-4 w-4 text-[#108a07] border-gray-300 focus:ring-[#108a07]"
                            checked={selectedAddressId === address.id}
                            onChange={() => selectAddress(address.id)}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`address-${address.id}`} className="font-medium text-gray-900 text-lg">
                            {address.type}
                          </label>
                          <div className="mt-2 text-gray-700">
                            <p>
                              {address.street} {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="mt-1">Mobile Number: {address.mobileNumber}</p>
                          </div>
                          {selectedAddressId === address.id && (
                            <div className="mt-4 flex space-x-4">
                              <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-[#1a1a1a] hover:bg-gray-50"
                                onClick={() => removeAddress(address.id)}
                              >
                                Remove
                              </button>
                              <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-[#1a1a1a] hover:bg-gray-50"
                                onClick={() => handleEdit(address.id)}
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
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-serif mb-6">Delivery estimates</h2>

              <div className="border-b border-gray-200 pb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center py-2">
                    <div className="w-12 h-12 relative mr-4">
                      <Image
                        src={item.product.image || "/placeholder.svg?height=48&width=48&query=jewelry"}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <p className="text-gray-700">Estimated Delivery by 10th May 2025</p>
                  </div>
                ))}
              </div>

              <div className="py-4 space-y-3 border-b border-gray-200">
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

              <div className="pt-4 mb-6">
                <div className="flex justify-between text-xl font-medium">
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              <button
                className="w-full py-3 bg-black text-white rounded-md font-medium"
                onClick={handleContinue}
                disabled={!selectedAddressId}
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
}

function AddressForm({ editingAddressId, onCancel }: AddressFormProps) {
  const { addresses, addAddress, updateAddress } = useAddressStore()
  const editingAddress = editingAddressId ? addresses.find((addr) => addr.id === editingAddressId) : null

  const [formData, setFormData] = useState<Omit<Address, "id">>({
    type: editingAddress?.type || "Home",
    street: editingAddress?.street || "",
    city: editingAddress?.city || "",
    state: editingAddress?.state || "",
    zipCode: editingAddress?.zipCode || "",
    mobileNumber: editingAddress?.mobileNumber || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (type: string) => {
    setFormData((prev) => ({ ...prev, type }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAddressId) {
      updateAddress(editingAddressId, formData)
    } else {
      addAddress(formData)
    }
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          className={`flex items-center px-4 py-2 rounded-md ${
            formData.type === "Home" ? "bg-[#108a07] text-white" : "border border-gray-300 text-gray-700"
          }`}
          onClick={() => handleTypeChange("Home")}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </button>
        <button
          type="button"
          className={`flex items-center px-4 py-2 rounded-md ${
            formData.type === "Office" ? "bg-[#108a07] text-white" : "border border-gray-300 text-gray-700"
          }`}
          onClick={() => handleTypeChange("Office")}
        >
          <Building2 className="w-4 h-4 mr-2" />
          Office
        </button>
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

      <div className="grid grid-cols-2 gap-4">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108a07]"
          />
        </div>
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#108a07]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-[#108a07] text-white rounded-md hover:bg-[#0c7206]">
          {editingAddressId ? "Update Address" : "Save Address"}
        </button>
      </div>
    </form>
  )
}
