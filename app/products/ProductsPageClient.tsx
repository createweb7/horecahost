"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { ProductWithRelations, Category, Brand } from "@/lib/types";
import Footer from "@/components/global/Footer";
import { Download, Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const activeFilterCount = (selectedCategoryId !== null ? 1 : 0) + selectedBrandIds.length;

  const clearAllFilters = () => {
    setSelectedCategoryId(null);
    setSelectedBrandIds([]);
    setPage(1);
  };

  const pages = Math.ceil(total / limit);

  const sidebarContent = (
    <>
      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Categories</h2>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          )}
        </div>
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
    </>
  );

  const sortControl = (
    <div className="relative w-full">
      <select
        aria-label="Sort products"
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          setPage(1);
        }}
        className="w-full appearance-none border border-gray-300 rounded-lg pl-4 pr-9 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  );

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

        <div className="mx-auto max-w-7xl px-6 sm:px-8 py-6 sm:py-10">
          {/* Page header */}
          <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 mb-5 sm:mb-10">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                Professional equipment.
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Equipment for kitchens, cafés and hospitality.
              </p>
            </div>
            <a
              href={CATALOGUE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center justify-center gap-2 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold px-4 py-2 sm:px-5 sm:py-3 rounded-xl transition-colors shrink-0 text-sm sm:text-base"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Download catalogue
              <span className="text-xs font-normal border border-red-200 rounded px-1.5 py-0.5">
                PDF
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            {/* Sidebar — desktop only */}
            <aside className="hidden lg:block lg:sticky lg:top-6 lg:self-start space-y-8">
              {sidebarContent}
            </aside>

            {/* Main content */}
            <div>
              {/* Search */}
              <div className="relative mb-3 sm:mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or models..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Filters + Sort — mobile/tablet only */}
              <div className="lg:hidden grid grid-cols-2 gap-3 mb-4">
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-4 overflow-y-auto">
                    <SheetHeader className="p-0 mb-2">
                      <SheetTitle className="text-lg">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-8">{sidebarContent}</div>
                    <button
                      type="button"
                      onClick={() => setMobileFiltersOpen(false)}
                      className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                      Show {total} {total === 1 ? "result" : "results"}
                    </button>
                  </SheetContent>
                </Sheet>
                {sortControl}
              </div>

              {/* Category heading — mobile only (compact) */}
              <h2 className="lg:hidden text-base font-bold text-gray-900 mb-3">
                {activeCategoryName}
              </h2>

              {/* Results header — desktop only */}
              <div className="hidden lg:flex lg:items-center lg:justify-between gap-3 mb-6">
                <h2 className="text-xl font-bold text-gray-900">{activeCategoryName}</h2>
                <div className="w-48 shrink-0">{sortControl}</div>
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
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} locale="en" showViewDetails />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="mt-8 sm:mt-12 flex justify-center items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        aria-label="Previous page"
                        className="rounded border border-gray-300 p-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4 sm:hidden" />
                        <span className="hidden sm:inline">Previous</span>
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
                              <span className="px-1 sm:px-2 text-gray-500">...</span>
                            ) : (
                              <button
                                onClick={() => setPage(p as number)}
                                className={`rounded px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm font-medium ${
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
                        aria-label="Next page"
                        className="rounded border border-gray-300 p-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4 sm:hidden" />
                        <span className="hidden sm:inline">Next</span>
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
