"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { ProductWithRelations, Category, Brand } from "@/lib/types";
import Footer from "@/components/global/Footer";
import { Download, Search } from "lucide-react";

const CATALOGUE_PDF_URL = "https://admin.horecahost.com/catalogue/HorecaHost_Catalogue.pdf";

const SORT_OPTIONS = [
  { value: "newest", label: "Default" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
];

interface ProductsPageClientProps {
  initialProducts: ProductWithRelations[];
  initialCategories: Category[];
  initialBrands: Brand[];
  initialTotal: number;
  initialSearch: string;
}

export default function ProductsPageClient({
  initialProducts,
  initialCategories,
  initialBrands,
  initialTotal,
  initialSearch,
}: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductWithRelations[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [brands] = useState<Brand[]>(initialBrands);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState(() => initialSearch || searchParams.get("search") || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setSearch(urlSearch);
    setPage(1);
  }, [searchParams]);

  const hasSkippedInitialProductsFetch = useRef(false);
  const limit = 12;

  useEffect(() => {
    if (!hasSkippedInitialProductsFetch.current) {
      hasSkippedInitialProductsFetch.current = true;
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort,
          ...(search && { search }),
          ...(selectedCategoryId && { category: selectedCategoryId.toString() }),
          ...(selectedBrandIds.length > 0 && { brand: selectedBrandIds.join(",") }),
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
  }, [page, search, selectedCategoryId, selectedBrandIds, sort]);

  const toggleBrand = (id: number) => {
    setSelectedBrandIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
    setPage(1);
  };

  const selectCategory = (id: number | null) => {
    setSelectedCategoryId(id);
    setPage(1);
  };

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands;
    const q = brandSearch.trim().toLowerCase();
    return brands.filter((b) => b.name_en.toLowerCase().includes(q));
  }, [brands, brandSearch]);

  const activeCategoryName =
    categories.find((c) => c.id === selectedCategoryId)?.name_en || "All products";

  const pages = Math.ceil(total / limit);

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
              {" › "}
              <span className="text-gray-900 font-semibold">Products</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 sm:px-8 py-10">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Professional equipment.
              </h1>
              <p className="text-gray-600">
                Explore equipment for kitchens, cafés and hospitality.
              </p>
            </div>
            <a
              href={CATALOGUE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold px-5 py-3 rounded-xl transition-colors shrink-0"
            >
              <Download className="w-5 h-5" />
              Download catalogue
              <span className="text-xs font-normal border border-red-200 rounded px-1.5 py-0.5">
                PDF
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-6 lg:self-start space-y-8">
              {/* Categories */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
                <ul className="space-y-1">
                  <li>
                    <button
                      type="button"
                      onClick={() => selectCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors border-l-4 ${
                        selectedCategoryId === null
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-transparent text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All products
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => selectCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors border-l-4 ${
                          selectedCategoryId === category.id
                            ? "border-red-600 bg-red-50 text-red-600"
                            : "border-transparent text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {category.name_en}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Brands</h2>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search brands..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {filteredBrands.length === 0 ? (
                    <p className="text-xs text-gray-400">No brands match &ldquo;{brandSearch}&rdquo;</p>
                  ) : (
                    filteredBrands.map((brand) => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrandIds.includes(brand.id)}
                          onChange={() => toggleBrand(brand.id)}
                          className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                        />
                        {brand.name_en}
                      </label>
                    ))
                  )}
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by product name, brand or model..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Results header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-xl font-bold text-gray-900">{activeCategoryName}</h2>
                <div className="flex items-center gap-2 shrink-0">
                  <label htmlFor="sort" className="text-sm text-gray-500 shrink-0">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">No products found</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} locale="en" showViewDetails />
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

                      {(() => {
                        const pageNumbers: (number | string)[] = [];
                        const maxVisible = 5;
                        const halfWindow = Math.floor(maxVisible / 2);

                        pageNumbers.push(1);

                        let start = Math.max(2, page - halfWindow);
                        let end = Math.min(pages - 1, page + halfWindow);

                        if (page <= halfWindow + 1) {
                          end = Math.min(pages - 1, maxVisible - 1);
                        }
                        if (page >= pages - halfWindow) {
                          start = Math.max(2, pages - maxVisible + 2);
                        }

                        if (start > 2) {
                          pageNumbers.push("...");
                        }

                        for (let i = start; i <= end; i++) {
                          pageNumbers.push(i);
                        }

                        if (end < pages - 1) {
                          pageNumbers.push("...");
                        }

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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
