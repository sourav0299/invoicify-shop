"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Package,
  LogOut,
  Edit,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserAddress {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: UserAddress[];
  isComplete?: boolean;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  userEmail: string;
  orderAmount: number;
  paymentDetails: {
    paymentId: string;
    orderId: string;
    signature: string;
    status: 'pending' | 'completed' | 'failed';
  };
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  orderStatus: 'processing' | 'confirmed' | 'shipped' | 'delivered';
  deliveryDate: {
    expected: string;
    actual?: string;
  };
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    phone: "",
    email: user?.email,
    address: [],
    isComplete: false
  });

  const fetchOrders = async (email: string) => {
    try {
      setOrdersLoading(true);
      const response = await fetch(`/api/orders?email=${email}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    }finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchOrders(user.email);
    }
  }, [user?.email]);

  const fetchUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/users/${email}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || [],
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/${user.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...formData, isComplete: true}),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      await fetchUserProfile(user.email);
      toast.success("Default address Changed Successfully")
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchUserProfile(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-[180px] px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-20">
        <h1 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] mb-8">
          My Account
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  width={50}
                  height={50}
                  src={user?.photoURL || <UserRound />}
                  alt="Profile"
                  className="rounded-full object-cover"
                />
                <div>
                  <h2 className="font-medium text-lg">{user?.displayName}</h2>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                    activeTab === "profile"
                      ? "bg-[#1a1a1a] text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 ${
                    activeTab === "orders"
                      ? "bg-[#1a1a1a] text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => {
                    signOut(auth)
                    router.push('/')
                  }}              
                  className="w-full text-left px-4 py-2 rounded-md flex items-center gap-3 text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Personal Information</h2>
                  <div className="flex items-center gap-2 text-[#1a1a1a]">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="border-none shadow-none px-0 hover:bg-white"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleSubmit}>
                          <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                              Make changes to your profile here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Jhon Choco"
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="phone" className="text-right">
                                Phone
                              </Label>
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                  })
                                }
                                placeholder="9876543210"
                                className="col-span-3 py-2"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="street" className="text-right">
                                Street
                              </Label>
                              <Input
                                id="street"
                                value={formData.address?.[0]?.street}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: [{
                                      ...formData.address?.[0],
                                      street: e.target.value,
                                    }],
                                  })
                                }
                                placeholder="143 Avenue street park"
                                className="col-span-3 py-2"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="city" className="text-right">
                                City
                              </Label>
                              <Input
                                id="city"
                                value={formData.address?.[0]?.city}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: [{
                                      ...formData.address?.[0],
                                      city: e.target.value,
                                    }],
                                  })
                                }
                                placeholder="Albuquerque"
                                className="col-span-3 py-2"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="state" className="text-right">
                                State
                              </Label>
                              <Input
                                id="state"
                                value={formData.address?.[0]?.state}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: [{
                                      ...formData.address?.[0],
                                      state: e.target.value,
                                    }],
                                  })
                                }
                                placeholder="New Mexico"
                                className="col-span-3 py-2"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="zipcode" className="text-right">
                                zipCode
                              </Label>
                              <Input
                                id="zipcode"
                                value={formData.address?.[0]?.zipCode}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: [{
                                      ...formData.address?.[0],
                                      zipCode: e.target.value,
                                    }],
                                  })
                                }
                                placeholder="87101"
                                className="col-span-3 py-2"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">{loading ? 'Saving...' : 'Save Changes'}</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium">{user?.displayName || formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium">{user?.phoneNumber || formData.phone}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-medium">Addresses</h2>
    </div>

    {(formData.address || []).length > 0 ? (
      <div className="space-y-4">
        {formData.address?.map((addr) => (
          <div key={addr.name} className="">
            <p className="font-medium">{addr.name || 'Default Address'}</p>
            <p className="text-gray-600 mt-1">
              {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
            </p>
            {formData.phone && <p className="text-gray-600">{formData.phone}</p>}
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No addresses added yet.</p>
    )}
  </div>

              </div>
            ) : activeTab === "orders" ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-medium mb-6">Order History</h2>
              
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#108a07]"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-medium">Order #{order.paymentDetails.orderId.slice(-8)}</p>
                              <p className="text-sm text-gray-500">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {new Intl.NumberFormat('en-IN', {
                                  style: 'currency',
                                  currency: 'INR'
                                }).format(order.orderAmount)}
                              </p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.orderStatus === 'processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </div>
                          </div>
              
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.productId} className="flex items-center gap-4">
                                <div className="w-16 h-16 relative">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-medium">
                                  {new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR'
                                  }).format(item.price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>
              
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm">
                              Delivery to: {order.shippingAddress.name}<br />
                              {order.shippingAddress.street}, {order.shippingAddress.city},<br />
                              {order.shippingAddress.state} {order.shippingAddress.zipCode}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Expected delivery by {new Date(order.deliveryDate.expected).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-500 max-w-md mb-6">
                        When you place your first order, it will appear here. You'll be able to track your orders and view your order history.
                      </p>
                      <Link
                        href="/shop"
                        className="px-6 py-3 bg-[#1a1a1a] text-white rounded-md hover:bg-black transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
