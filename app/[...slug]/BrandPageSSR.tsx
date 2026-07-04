"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/global/Footer";
import ProductCard from "@/components/products/ProductCard";
import { ProductWithRelations, Brand, SubcategoryWithRelations } from "@/lib/types";

interface Props {
  brand: Brand;
  heroText: { h1: string; h2: string; paragraph: string };
  initialProducts: ProductWithRelations[];
  totalProducts: number;
  subcategories: (SubcategoryWithRelations & { productCount?: number })[];
}

const LIMIT = 12;
const INITIAL_SUBCATEGORIES_SHOW = 4;

export default function BrandPageSSR({
  brand,
  heroText,
  initialProducts,
  totalProducts,
  subcategories,
}: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const totalPages = Math.ceil(totalProducts / LIMIT);

  const goToPage = async (newPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?brand=${brand.id}&page=${newPage}&limit=${LIMIT}`);
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
            <Link href="/brands" className="hover:text-gray-900">Brands</Link>
            {" › "}
            <span className="text-gray-900 font-semibold">{brand.name_en}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-12 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{heroText.h1}</h1>
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-red-600" />
          </div>
          {heroText.h2 && <h2 className="text-lg text-gray-600 mb-2">{heroText.h2}</h2>}
          {heroText.paragraph && <p className="text-gray-600">{heroText.paragraph}</p>}
          {!heroText.paragraph && !heroText.h2 && brand.country_en && (
            <p className="text-lg text-gray-600">📍 {brand.country_en}</p>
          )}
        </div>
      </div>

      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {subcategories.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">Popular Products by Type</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {subcategories
                  .slice(0, showAllSubcategories ? subcategories.length : INITIAL_SUBCATEGORIES_SHOW)
                  .map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/${brand.slug}-${subcategory.slug}`}
                      className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:shadow-md hover:border-blue-500"
                    >
                      {brand.image_path && (
                        <div className="mb-3 flex items-center justify-center h-16">
                          <Image
                            src={brand.image_path}
                            alt={brand.name_en}
                            className="h-full w-auto object-contain"
                            width={64}
                            height={64}
                          />
                        </div>
                      )}
                      <span className="font-semibold text-gray-900">
                        {brand.name_en} {subcategory.name_en}
                      </span>
                      {subcategory.productCount !== undefined && (
                        <span className="text-sm text-gray-500 mt-1">
                          ({subcategory.productCount} {subcategory.productCount === 1 ? "product" : "products"})
                        </span>
                      )}
                    </Link>
                  ))}
              </div>
              {subcategories.length > INITIAL_SUBCATEGORIES_SHOW && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => setShowAllSubcategories(!showAllSubcategories)}
                    className="inline-block rounded-lg bg-red-600 text-white px-6 py-2 font-medium hover:bg-red-700 transition-colors"
                  >
                    {showAllSubcategories
                      ? `Show Less (${INITIAL_SUBCATEGORIES_SHOW} of ${subcategories.length})`
                      : `View More (${subcategories.length - INITIAL_SUBCATEGORIES_SHOW} more)`}
                  </button>
                </div>
              )}
            </div>
          )}

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
              <p className="text-gray-500">No products found from this brand.</p>
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
