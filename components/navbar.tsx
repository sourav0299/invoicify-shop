"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Menu, Mic, Heart, UserRound } from "lucide-react";
import CartCounter from "@/components/cart-counter";
import CategoryNav from "./category-nav";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "./ui/button";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === "/";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Set text color based on current page
  const textColor = isHomePage ? "text-white" : "text-black";
  const borderColor = isHomePage ? "border-white/30" : "border-black/30";
  const placeholderColor = isHomePage
    ? "placeholder:text-white/50"
    : "placeholder:text-black/50";

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-10 px-16 py-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Nayra Jewels Logo"
                width={30}
                height={30}
              />
            </Link>

            <Link href="/" className="flex items-center">
              <Image
                src="/Nayra Jewels.png"
                alt="Nayra Jewels Logo"
                width={120}
                height={40}
                className="h-auto w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex items-center">
              <div
                className={`relative flex items-center rounded-md border ${borderColor} bg-transparent px-3 py-1.5`}
              >
                <Search className={`h-4 w-4 ${textColor}/70 mr-2`} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent text-sm ${textColor} outline-none ${placeholderColor} w-40`}
                />
                <button
                  aria-label="Voice search"
                  className={`ml-1 ${textColor}/70 hover:${textColor} transition-colors`}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              aria-label="Search"
              className={`md:hidden p-2 ${textColor}`}
            >
              <Search className="h-5 w-5" />
            </button>
            {user ? (
              <>
                <button
                onClick={() => router.push("/profile")}
                aria-label="Profile"
                className={`p-2 ${textColor}`}
              >
                <Image
                  width={30}
                  height={30}
                  src={user?.photoURL || <UserRound />}
                  alt="Profile"
                  className="rounded-full object-cover"
                />
              </button>
              <Button variant="destructive" onClick={() => signOut(auth)}>Logout</Button>
              </>
            ) : (
              <button
                onClick={() => router.push("/login")}
                aria-label="Account"
                className={`p-2 ${textColor}`}
              >
                <User className="h-5 w-5" />
              </button>
            )}
            <button aria-label="Wishlist" className={`p-2 ${textColor}`} onClick={() => router.push('/wishlist')}>
              <Heart className="h-5 w-5" />
            </button>
            <CartCounter isHomePage={isHomePage} />
            <button aria-label="Menu" className={`md:hidden p-2 ${textColor}`}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>
      <CategoryNav />
    </>
  );
}
