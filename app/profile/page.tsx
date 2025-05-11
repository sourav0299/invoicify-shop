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
import { onAuthStateChanged } from "firebase/auth";
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
  address?: UserAddress;
  isComplete?: boolean;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    phone: "",
    email: user?.email,
    address: {
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const fetchUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/users/${email}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      console.log(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || {
          name: data.name,
          street: "",
          city: "",
          state: "",
          zipCode: "",
        },
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
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      // Refresh the profile data
      await fetchUserProfile(user.email);
      // Close the dialog
      document.querySelector<HTMLButtonElement>("[data-dialog-close]")?.click();
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
                  <div className="flex items-center gap-2 text-[#1a1a1a]">
                    <Dialog>
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
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="street" className="text-right">
                                Street
                              </Label>
                              <Input
                                id="street"
                                value={formData.address?.street}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: {
                                      ...formData.address,
                                      street: e.target.value,
                                    },
                                  })
                                }
                                placeholder="143 Avenue street park"
                                className="col-span-3 py-2"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="city" className="text-right">
                                City
                              </Label>
                              <Input
                                id="city"
                                value={formData.address?.city}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: {
                                      ...formData.address,
                                      city: e.target.value,
                                    },
                                  })
                                }
                                placeholder="Albuquerque"
                                className="col-span-3 py-2"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="state" className="text-right">
                                State
                              </Label>
                              <Input
                                id="state"
                                value={formData.address?.state}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: {
                                      ...formData.address,
                                      state: e.target.value,
                                    },
                                  })
                                }
                                placeholder="New Mexico"
                                className="col-span-3 py-2"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="zipcode" className="text-right">
                                zipCode
                              </Label>
                              <Input
                                id="zipcode"
                                value={formData.address?.zipCode}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    address: {
                                      ...formData.address,
                                      zipCode: e.target.value,
                                    },
                                  })
                                }
                                placeholder="87101"
                                className="col-span-3 py-2"
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
                    <h2 className="text-xl font-medium">Address</h2>
                  </div>

                  <div>
                    <p className="font-medium">{user?.displayName || formData.name}</p>
                    <p className="text-gray-600 mt-1">
                      {user?.address || `${formData.address?.street} ${formData.address?.city} ${formData.address?.state} ${formData.address?.zipCode}`}
                    </p>
                    <p className="text-gray-600">{user?.phoneNumber || formData.phone}</p>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-500 max-w-md mb-6">
                    When you place your first order, it will appear here. You'll
                    be able to track your orders and view your order history.
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
  );
}
