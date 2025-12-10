'use client';
import { useAuthStore } from '@/store/use-auth-store';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Sidebar / Nav placeholder */}
            <nav className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <span className="font-bold text-xl text-indigo-600">College ERP</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => logout()}
                                className="ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
