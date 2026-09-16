"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/global/Footer";
import ProductCard from "@/components/products/ProductCard";
import { ProductWithRelations, Brand, SubcategoryWithRelations } from "@/lib/types";

interface Props {
  brand: Brand;
  subcategory: SubcategoryWithRelations;
  initialProducts: ProductWithRelations[];
  totalProducts: number;
}

const LIMIT = 12;

export default function BrandSubcategoryPageSSR({
  brand,
  subcategory,
  initialProducts,
  totalProducts,
}: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(totalProducts / LIMIT);

  const goToPage = async (newPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products?brand=${brand.id}&subcategory=${subcategory.id}&page=${newPage}&limit=${LIMIT}`,
      );
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            {" › "}
            <Link href={`/${brand.slug}`} className="hover:text-gray-900">{brand.name_en}</Link>
            {" › "}
            <span className="text-gray-900 font-semibold">{subcategory.name_en}</span>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900">
              {brand.name_en} {subcategory.name_en}
            </h1>
            <p className="text-gray-600 mt-4">{totalProducts} products available</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} locale="en" />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">No products found for this brand and subcategory.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                .map((p, idx, arr) => (
                  <div key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-2 text-gray-500">...</span>}
                    <button
                      onClick={() => goToPage(p)}
                      disabled={loading}
                      className={`px-4 py-2 rounded border ${
                        page === p
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                ))}
              <button
                onClick={() => goToPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
