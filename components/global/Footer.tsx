"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Category, Subcategory } from "@/lib/types";

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/subcategories"),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubcategories(subData.subcategories || []);
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      }
    };

    fetchData();
  }, []);

  // Group subcategories by category
  const subcategoriesByCategory = categories.map((cat) => ({
    category: cat,
    subs: subcategories.filter((sub) => sub.category_id === cat.id),
  }));

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Categories & Subcategories */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {subcategoriesByCategory
            .filter(({ category }) => category.name_en !== "Accessories")
            .map(({ category, subs }) => (
            <div key={category.id}>
              <h3 className="text-lg font-semibold mb-4 text-blue-400">
                {category.name_en}
              </h3>
              {subs.length > 0 ? (
                <ul className="space-y-2">
                  {subs.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/${sub.slug}`}
                        className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                      >
                        {sub.name_en}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <Link
                  href={`/${category.slug}`}
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  View Products →
                </Link>
              )}
            </div>
          ))}

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Brands
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@horecahost.com"
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          {/* Bottom Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-sm">About Us</h4>
              <p className="text-gray-400 text-sm">
                Your trusted supplier of premium hospitality and commercial
                kitchen equipment.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Contact Info</h4>
              <p className="text-gray-400 text-sm">
                <strong>Address:</strong> Al Garhoud, Dubai, UAE
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Email:</strong> info@horecahost.com
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Phone:</strong> +971 50 307 9863
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Business Hours</h4>
              <p className="text-gray-400 text-sm">
                Mon-Fri: 9:00 AM - 6:00 PM
              </p>
              <p className="text-gray-400 text-sm">Sat-Sun: Closed</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm">
            <p>&copy; 2025 HorecaHost. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
