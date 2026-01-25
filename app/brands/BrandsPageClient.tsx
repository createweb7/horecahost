"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/lib/types";
import Footer from "@/components/global/Footer";

export default function BrandsPageClient() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 12;

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/brands?page=${page}&limit=${limit}`);
        const data = await res.json();

        setBrands(data.brands);
        setTotal(data.total);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [page]);

  const pages = Math.ceil(total / limit);

  // Smart pagination: show pages 1, current-1, current, current+1, last
  const getPaginationPages = () => {
    const result = new Set<number>();
    result.add(1);
    if (page > 1) result.add(page - 1);
    result.add(page);
    if (page < pages) result.add(page + 1);
    if (pages > 1) result.add(pages);
    return Array.from(result).sort((a, b) => a - b);
  };

  const paginationPages = getPaginationPages();

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            {" › "}
            <span className="text-gray-900 font-semibold">Brands</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Brands</h1>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-600">
              Explore our curated selection of premium brands
            </p>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-16">
          {loading ? (
            <div className="flex justify-center items-center min-h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No brands found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.id}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex items-center justify-center p-4">
                      {brand.image_path ? (
                        <Image
                          src={brand.image_path}
                          alt={brand.name_en}
                          width={200}
                          height={200}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-600 font-semibold text-sm">
                            {brand.name_en}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="mt-3 font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                      {brand.name_en}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {paginationPages.map((p, idx) => (
                    <div key={p}>
                      {idx > 0 &&
                        paginationPages[idx - 1] < p - 1 && (
                        <span className="px-2">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          page === p
                            ? "bg-red-600 text-white border-red-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => setPage(Math.min(pages, page + 1))}
                    disabled={page === pages}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
