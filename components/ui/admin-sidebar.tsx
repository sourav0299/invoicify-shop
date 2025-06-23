'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, LayoutDashboard, Package, ShoppingBag, ImageIcon } from 'lucide-react';

const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { title: 'Products', path: '/admin/product-listing', icon: Package },
    { title: 'Banners', path: '/admin/banner-management', icon: ImageIcon },
];

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <div className={`min-h-screen bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    {!isCollapsed && <h2 className="text-xl font-semibold">Admin</h2>}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
                <nav className="flex-1 p-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center px-3 py-2 mb-1 rounded-lg transition-colors ${
                                    isActive ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={20} />
                                {!isCollapsed && (
                                    <span className="ml-3">{item.title}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
