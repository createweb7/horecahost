"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  totalSubcategories: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    totalSubcategories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, brandsRes, subcategoriesRes] = await Promise.all([
          fetch("/api/admin/products?limit=1"),
          fetch("/api/admin/categories?limit=1"),
          fetch("/api/admin/brands?limit=1"),
          fetch("/api/admin/subcategories?limit=1"),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();
        const subcategoriesData = await subcategoriesRes.json();

        setStats({
          totalProducts: productsData.total || 0,
          totalCategories: categoriesData.total || 0,
          totalBrands: brandsData.total || 0,
          totalSubcategories: subcategoriesData.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "bg-blue-500",
      href: "/admin/products",
    },
    {
      title: "Total Categories",
      value: stats.totalCategories,
      icon: "📂",
      color: "bg-green-500",
      href: "/admin/categories",
    },
    {
      title: "Total Brands",
      value: stats.totalBrands,
      icon: "🏢",
      color: "bg-purple-500",
      href: "/admin/brands",
    },
    {
      title: "Total Subcategories",
      value: stats.totalSubcategories,
      icon: "📁",
      color: "bg-orange-500",
      href: "/admin/subcategories",
    },
  ];

  const quickActions = [
    { label: "Add Product", href: "/admin/products/new", icon: "➕" },
    { label: "Add Category", href: "/admin/categories/new", icon: "➕" },
    { label: "Add Brand", href: "/admin/brands/new", icon: "➕" },
    { label: "Manage Products", href: "/admin/products", icon: "⚙️" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the admin panel</p>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded mt-4 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} text-white p-4 rounded-lg text-3xl`}>
                  {card.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium text-gray-900">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity / Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
        <p className="text-blue-800">
          Use the sidebar to navigate to different sections. You can add, edit, and delete products, categories, brands, and subcategories from their respective pages.
        </p>
      </div>
    </div>
  );
}
