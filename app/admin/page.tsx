"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const cards = [
    {
      title: "Categories",
      count: 0,
      icon: "📂",
      href: "/admin/categories",
      color: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Subcategories",
      count: 0,
      icon: "📁",
      href: "/admin/subcategories",
      color: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Brands",
      count: 0,
      icon: "🏢",
      href: "/admin/brands",
      color: "bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      title: "Products",
      count: 0,
      icon: "📦",
      href: "/admin/products",
      color: "bg-orange-100",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div className={`${card.color} rounded-lg p-6 cursor-pointer hover:shadow-lg transition`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor} mt-2`}>
                    {card.count}
                  </p>
                </div>
                <div className="text-4xl">{card.icon}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/categories/new" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition text-center">
            Add Category
          </Link>
          <Link href="/admin/subcategories/new" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition text-center">
            Add Subcategory
          </Link>
          <Link href="/admin/brands/new" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition text-center">
            Add Brand
          </Link>
          <Link href="/admin/products/new" className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded transition text-center">
            Add Product
          </Link>
        </div>
      </div>
    </div>
  );
}
