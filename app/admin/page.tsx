"use client"

import { useState } from "react"
import { Search, Calendar, Plus, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Order status component with appropriate styling
const OrderStatus = ({ status }: { status: string }) => {
  let color = ""
  let bgColor = ""

  switch (status.toLowerCase()) {
    case "delivered":
      color = "text-green-600"
      bgColor = "bg-green-100"
      break
    case "ordered":
      color = "text-blue-600"
      bgColor = "bg-blue-100"
      break
    case "replaced":
      color = "text-red-600"
      bgColor = "bg-red-100"
      break
    case "cancelled":
      color = "text-gray-600"
      bgColor = "bg-gray-200"
      break
    case "in progress":
      color = "text-amber-600"
      bgColor = "bg-amber-100"
      break
    default:
      color = "text-gray-600"
      bgColor = "bg-gray-100"
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${color}`}>
      {status === "in progress" ? "In Progress" : status}
    </span>
  )
}

// Mock data for orders
const orders = [
  {
    id: "#1212121",
    customer: "Minesh",
    product: "Diamond necklace with pendant",
    orderDate: "25/1/25",
    deliveryDate: "28/1/25",
    price: "₹50,000",
    status: "Delivered",
  },
  {
    id: "#22222",
    customer: "Sourav",
    product: "Nature-Inspired Gold Earrings",
    orderDate: "25/1/25",
    deliveryDate: "28/1/25",
    price: "₹50,000",
    status: "Ordered",
  },
 
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All Orders") return true
    if (activeTab === "In progress" && order.status === "In Progress") return true
    if (activeTab === "Completed" && order.status === "Delivered") return true
    if (activeTab === "Cancelled" && order.status === "Cancelled") return true
    if (activeTab === "Replaced" && order.status === "Replaced") return true
    return false
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Check your products here</p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search" className="pl-10 h-11 w-full" />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="h-11 px-4 flex items-center gap-2 text-gray-700 bg-white">
              <Calendar className="h-4 w-4" />
              <span>Mar 2025 - Apr 2025</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <Button className="h-11 bg-black hover:bg-gray-800 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add new product</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {["All Orders", "In progress", "Completed", "Cancelled", "Replaced"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Delivery date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.deliveryDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatus status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center">
                        <Link href={`/admin/orders/${order.id}`} className="text-gray-900 hover:text-gray-700">
                          View Details
                        </Link>
                        <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-end">
            <nav className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8 px-3">
                Prev
              </Button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 ${page === currentPage ? "bg-gray-900 text-white" : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page === 1 ? "01" : page === 2 ? "02" : page === 3 ? "03" : page === 4 ? "04" : "05"}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-8 px-2">
                ...
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                24
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-3">
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
