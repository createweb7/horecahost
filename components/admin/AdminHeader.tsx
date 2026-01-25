"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Admin Panel
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/admin/dashboard"
              className="hover:text-blue-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="hover:text-blue-400 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/admin/categories"
              className="hover:text-blue-400 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/admin/brands"
              className="hover:text-blue-400 transition-colors"
            >
              Brands
            </Link>
          </nav>

          {/* Mobile Menu Button & User Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors text-sm font-medium"
            >
              Logout
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/admin/dashboard"
              className="block hover:text-blue-400 transition-colors py-2"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block hover:text-blue-400 transition-colors py-2"
            >
              Products
            </Link>
            <Link
              href="/admin/categories"
              className="block hover:text-blue-400 transition-colors py-2"
            >
              Categories
            </Link>
            <Link
              href="/admin/brands"
              className="block hover:text-blue-400 transition-colors py-2"
            >
              Brands
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
