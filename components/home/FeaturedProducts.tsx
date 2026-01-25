"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { ProductWithRelations } from "@/lib/types";
import Link from "next/link";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?limit=8");
        if (res.ok) {
          const data = await res.json();
          setProducts((data.products || []).slice(0, 8));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="py-12"></div>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link
            href="/products"
            className="inline-block rounded-lg bg-red-600 text-white px-6 py-2 font-medium hover:bg-red-700 transition-colors"
          >
            View All
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale="en" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available</p>
          </div>
        )}
      </div>
    </section>
  );
}
