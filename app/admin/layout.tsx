'use client';

import AdminSidebar from '@/components/ui/admin-sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}
