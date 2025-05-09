"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Package, LogOut, Edit, ShoppingBag } from "lucide-react"


const userData = {
  name: "Minesh",
  email: "mineshpatel029@gmail.com",
  phone: "+917619351868",
  address: "Agrico Workers Flat",
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile")

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-[180px] px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-20">
        <h1 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] mb-8">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-22 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-10 h-8 text-gray-500" />
                </div>
                <div>
                  <h2 className="font-medium text-lg">{userData.name}</h2>
                  <p className="text-gray-500 text-sm">{userData.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                    activeTab === "profile" ? "bg-[#1a1a1a] text-white" : "hover:bg-gray-200"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                    activeTab === "orders" ? "bg-[#1a1a1a] text-white" : "hover:bg-gray-200"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </button>
                <Link
                  href="/logout"
                  className="w-full text-left px-4 py-2 rounded-md flex items-center gap-3 text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Personal Information</h2>
                  <button className="flex items-center gap-2 text-[#1a1a1a] hover:text-gray-700">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Address</h2>
                    <button className="flex items-center gap-2 text-[#1a1a1a] hover:text-gray-700">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div>
                    <p className="font-medium">{userData.name}</p>
                    <p className="text-gray-600 mt-1">{userData.address}</p>
                    <p className="text-gray-600">{userData.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-medium mb-6">Order History</h2>

                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    When you place your first order, it will appear here. You'll be able to track your orders and view
                    your order history.
                  </p>
                  <Link
                    href="/shop"
                    className="px-6 py-3 bg-[#1a1a1a] text-white rounded-md hover:bg-black transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
