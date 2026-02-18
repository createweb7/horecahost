"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { ProductWithRelations, Category } from "@/lib/types";
import Footer from "@/components/global/Footer";

export default function ProductsPageClient() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const limit = 12;
  const initialCategoriesShow = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await fetch(`/api/categories`);
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
        });

        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();

        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search]);

  const pages = Math.ceil(total / limit);

  return (
    <>
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              {" › "}
              <span className="text-gray-900 font-semibold">Products</span>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gray-50 py-12">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Products
              </h1>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1 bg-red-600"></div>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Browse our collection of high-quality hospitality equipment
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white mx-auto max-w-6xl xl:max-w-7xl px-8 py-12 w-full">
          {/* Categories Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Categories
            </h2>
            {categoriesLoading ? (
              <p className="text-gray-500">Loading categories...</p>
            ) : (
              <div className="space-y-4">
                {/* Categories Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {categories
                    .slice(
                      0,
                      showAllCategories
                        ? categories.length
                        : initialCategoriesShow
                    )
                    .map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.slug}`}
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:shadow-md hover:border-blue-500"
                      >
                        <span className="text-sm font-medium text-gray-900 line-clamp-2">
                          {category.name_en}
                        </span>
                      </Link>
                    ))}
                </div>

                {/* View More / Show Less Button */}
                {categories.length > initialCategoriesShow && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="inline-block rounded-lg bg-red-600 text-white px-6 py-2 font-medium hover:bg-red-700 transition-colors"
                    >
                      {showAllCategories
                        ? `Show Less (${initialCategoriesShow} of ${categories.length})`
                        : `View More (${
                            categories.length - initialCategoriesShow
                          } more)`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search products by name or model..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} locale="en" />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  {/* Page Numbers with Smart Pagination */}
                  {(() => {
                    const pageNumbers = [];
                    const maxVisible = 5;
                    const halfWindow = Math.floor(maxVisible / 2);

                    // Always show first page
                    pageNumbers.push(1);

                    // Calculate range around current page
                    let start = Math.max(2, page - halfWindow);
                    let end = Math.min(pages - 1, page + halfWindow);

                    // Adjust if near the beginning or end
                    if (page <= halfWindow + 1) {
                      end = Math.min(pages - 1, maxVisible - 1);
                    }
                    if (page >= pages - halfWindow) {
                      start = Math.max(2, pages - maxVisible + 2);
                    }

                    // Add ellipsis before
                    if (start > 2) {
                      pageNumbers.push("...");
                    }

                    // Add middle pages
                    for (let i = start; i <= end; i++) {
                      pageNumbers.push(i);
                    }

                    // Add ellipsis after
                    if (end < pages - 1) {
                      pageNumbers.push("...");
                    }

                    // Always show last page
                    if (pages > 1) {
                      pageNumbers.push(pages);
                    }

                    return pageNumbers.map((p, idx) => (
                      <div key={idx}>
                        {p === "..." ? (
                          <span className="px-2 text-gray-500">...</span>
                        ) : (
                          <button
                            onClick={() => setPage(p as number)}
                            className={`rounded px-3 py-2 text-sm font-medium ${
                              p === page
                                ? "bg-red-600 text-white"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        )}
                      </div>
                    ));
                  })()}

                  <button
                    onClick={() => setPage(Math.min(pages, page + 1))}
                    disabled={page === pages}
                    className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
