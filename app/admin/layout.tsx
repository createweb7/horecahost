"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (token || cookieToken) {
      setIsAuthorized(true);
    } else {
      router.push("/admin/login");
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Enquiries", href: "/admin/enquiries", icon: "📧" },
    { name: "Categories", href: "/admin/categories", icon: "📂" },
    { name: "Subcategories", href: "/admin/subcategories", icon: "📁" },
    { name: "Brands", href: "/admin/brands", icon: "🏢" },
    { name: "Products", href: "/admin/products", icon: "📦" },
    { name: "SEO Metadata", href: "/admin/seo-metadata", icon: "🔍" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    document.cookie = "adminToken=; Max-Age=0; path=/;";
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Admin Header */}
      <AdminHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-gray-900 text-white transition-all duration-300 flex flex-col overflow-y-auto`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {sidebarOpen && <h3 className="text-sm font-bold uppercase">Menu</h3>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-800 rounded"
              title={sidebarOpen ? "Collapse" : "Expand"}
            >
              {sidebarOpen ? "←" : "→"}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 transition"
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="text-sm">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-700 p-4">
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition text-sm font-medium"
              >
                Logout
              </button>
            )}
            {!sidebarOpen && (
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition text-sm"
                title="Logout"
              >
                ↓
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto flex flex-col">
          {/* Content */}
          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
