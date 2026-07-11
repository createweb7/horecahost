"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  Mail,
  LayoutGrid,
  Tag,
  SlidersHorizontal,
  Download,
} from "lucide-react";
import { ProductWithRelations, Brand, Category } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import Footer from "@/components/global/Footer";

const CATALOGUE_PDF_URL = "https://admin.horecahost.com/catalogue/HorecaHost_Catalogue.pdf";

interface Props {
  locale?: "en" | "ar";
}

export default function CataloguePageClient({ locale = "en" }: Props) {
  const isAr = locale === "ar";

  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const [productsLoading, setProductsLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const brandStripRef = useRef<HTMLDivElement>(null);
  const productSectionRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const limit = 12;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      setBrandsLoading(true);
      try {
        const res = await fetch("/api/brands?page=1&limit=200");
        const data = await res.json();
        setBrands(data.brands || []);
        setTotalBrands(data.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setBrandsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        if (search) params.set("search", search);
        if (selectedCategoryId) params.set("category", selectedCategoryId.toString());
        if (selectedBrandId) params.set("brand", selectedBrandId.toString());

        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data.products || []);
        setTotalProducts(data.total || 0);
      } catch (e) {
        console.error(e);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [page, search, selectedBrandId, selectedCategoryId]);

  const totalPages = Math.ceil(totalProducts / limit);
  const hasActiveFilters = search || selectedBrandId || selectedCategoryId;

  const clearFilters = () => {
    setSearch("");
    setSelectedBrandId(null);
    setSelectedCategoryId(null);
    setPage(1);
  };

  const scrollBrands = (dir: "left" | "right") => {
    if (!brandStripRef.current) return;
    brandStripRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectCategory = (id: number) => {
    setSelectedCategoryId(id === selectedCategoryId ? null : id);
    setPage(1);
    scrollToProducts();
  };

  const selectBrand = (id: number) => {
    setSelectedBrandId(id === selectedBrandId ? null : id);
    setPage(1);
  };

  const getPaginationPages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const activeBrandName = selectedBrandId
    ? brands.find((b) => b.id === selectedBrandId)?.[isAr ? "name_ar" : "name_en"]
    : null;
  const activeCategoryName = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)?.[isAr ? "name_ar" : "name_en"]
    : null;

  return (
    <>
      <main className="min-h-screen bg-gray-50" dir={isAr ? "rtl" : "ltr"}>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative bg-gray-900 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
          {/* dot grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          {/* red glow */}
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600 opacity-10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 pt-6 pb-16 sm:pb-24">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-8">
              <Link href={isAr ? "/ar" : "/"} className="hover:text-white transition-colors">
                {isAr ? "الرئيسية" : "Home"}
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-300">{isAr ? "الكتالوج" : "Catalogue"}</span>
            </nav>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                <LayoutGrid className="w-3.5 h-3.5" />
                {isAr ? "الكتالوج الكامل" : "Full Product Catalogue"}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight leading-tight">
                {isAr ? (
                  <>تصفح منتجاتنا الكاملة</>
                ) : (
                  <>
                    Explore Our{" "}
                    <span className="text-red-500">Complete</span> Range
                  </>
                )}
              </h1>

              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                {isAr
                  ? "اكتشف مجموعتنا الشاملة من معدات الضيافة والمطابخ التجارية من أفضل العلامات التجارية العالمية"
                  : "Premium hospitality & commercial kitchen equipment from the world's leading brands — all in one place"}
              </p>

              {/* Search */}
              <div className="relative max-w-2xl mx-auto mb-12">
                <Search
                  className={`absolute ${isAr ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`}
                />
                <input
                  type="text"
                  placeholder={isAr ? "ابحث عن منتجات، ماركات، موديلات..." : "Search products, brands, models..."}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className={`w-full bg-white rounded-2xl ${isAr ? "pr-12 pl-12" : "pl-12 pr-12"} py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-base shadow-2xl`}
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); setPage(1); }}
                    className={`absolute ${isAr ? "left-4" : "right-4"} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Download catalogue PDF */}
              <div className="mb-12">
                <a
                  href={CATALOGUE_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  {isAr ? "تحميل الكتالوج (PDF)" : "Download Catalogue (PDF)"}
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-10">
                <div>
                  <div className="text-4xl font-black text-white tabular-nums">
                    {totalBrands > 0 ? `${totalBrands}+` : "—"}
                  </div>
                  <div className="text-gray-400 text-sm mt-1 uppercase tracking-wider">
                    {isAr ? "علامة تجارية" : "Brands"}
                  </div>
                </div>
                <div className="w-px bg-gray-700 self-stretch hidden sm:block" />
                <div>
                  <div className="text-4xl font-black text-white tabular-nums">
                    {totalProducts > 0 ? `${totalProducts}+` : "—"}
                  </div>
                  <div className="text-gray-400 text-sm mt-1 uppercase tracking-wider">
                    {isAr ? "منتج" : "Products"}
                  </div>
                </div>
                <div className="w-px bg-gray-700 self-stretch hidden sm:block" />
                <div>
                  <div className="text-4xl font-black text-white tabular-nums">
                    {categories.length > 0 ? `${categories.length}+` : "—"}
                  </div>
                  <div className="text-gray-400 text-sm mt-1 uppercase tracking-wider">
                    {isAr ? "فئة" : "Categories"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BRAND STRIP ──────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-200 shadow-sm">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-8 py-5">
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                {isAr ? "حسب العلامة" : "By Brand"}
              </span>

              <button
                onClick={() => scrollBrands("left")}
                className="flex-none p-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              <div
                ref={brandStripRef}
                className="flex gap-2 overflow-x-auto flex-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {/* All Brands pill */}
                <button
                  onClick={() => { setSelectedBrandId(null); setPage(1); }}
                  className={`flex-none px-4 py-2 rounded-lg text-sm font-semibold border transition-all whitespace-nowrap ${
                    selectedBrandId === null
                      ? "bg-red-600 text-white border-red-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600"
                  }`}
                >
                  {isAr ? "الكل" : "All"}
                </button>

                {brandsLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex-none w-24 h-11 rounded-lg bg-gray-100 animate-pulse" />
                    ))
                  : brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => selectBrand(brand.id)}
                        title={isAr ? brand.name_ar : brand.name_en}
                        className={`flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                          selectedBrandId === brand.id
                            ? "border-red-600 bg-red-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        {brand.image_path ? (
                          <div className="relative w-14 h-8 flex-none">
                            <Image
                              src={brand.image_path}
                              alt={isAr ? brand.name_ar : brand.name_en}
                              fill
                              className="object-contain"
                              sizes="56px"
                            />
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-gray-700 whitespace-nowrap max-w-[80px] truncate">
                            {isAr ? brand.name_ar : brand.name_en}
                          </span>
                        )}
                      </button>
                    ))}
              </div>

              <button
                onClick={() => scrollBrands("right")}
                className="flex-none p-1.5 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </section>

        {/* ── CATEGORY BROWSER ─────────────────────────────────── */}
        {categories.length > 0 && (
          <section className="bg-white border-b border-gray-100 py-10">
            <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {isAr ? "حسب الفئة" : "By Category"}
                </span>
                {selectedCategoryId && (
                  <button
                    onClick={() => { setSelectedCategoryId(null); setPage(1); }}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    {isAr ? "مسح" : "Clear"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {categories.map((cat) => {
                  const isActive = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => selectCategory(cat.id)}
                      className={`group relative flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-200 ${
                        isActive
                          ? "border-red-500 bg-red-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-red-300 hover:shadow-sm hover:-translate-y-0.5"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-600" />
                      )}
                      <span
                        className={`text-sm font-semibold line-clamp-2 leading-snug ${
                          isActive
                            ? "text-red-700"
                            : "text-gray-800 group-hover:text-red-600"
                        }`}
                      >
                        {isAr ? cat.name_ar : cat.name_en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── STICKY FILTER BAR ────────────────────────────────── */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 py-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">

              {/* Filter label */}
              <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                  {isAr ? "فلتر" : "Filter"}
                </span>
              </div>

              <div className="w-px h-5 bg-gray-200 shrink-0" />

              {/* Custom category dropdown */}
              <div ref={categoryDropdownRef} className="relative shrink-0">
                <button
                  onClick={() => setCategoryDropdownOpen((o) => !o)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    selectedCategoryId
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 shrink-0" />
                  <span className="max-w-[140px] truncate">
                    {activeCategoryName ?? (isAr ? "كل الفئات" : "All Categories")}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 w-60 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
                    <div className="py-1 max-h-72 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCategoryId(null);
                          setPage(1);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                          !selectedCategoryId
                            ? "bg-red-50 text-red-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {isAr ? "كل الفئات" : "All Categories"}
                      </button>
                      <div className="my-1 border-t border-gray-100" />
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategoryId(cat.id);
                            setPage(1);
                            setCategoryDropdownOpen(false);
                            scrollToProducts();
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                            selectedCategoryId === cat.id
                              ? "bg-red-50 text-red-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {isAr ? cat.name_ar : cat.name_en}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Active filter chips */}
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                {activeBrandName && (
                  <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                    {isAr ? "العلامة:" : "Brand:"} {activeBrandName}
                    <button
                      onClick={() => { setSelectedBrandId(null); setPage(1); }}
                      className="hover:text-red-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                    &ldquo;{search}&rdquo;
                    <button
                      onClick={() => { setSearch(""); setPage(1); }}
                      className="hover:text-gray-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              <div className="ml-auto flex items-center gap-3 shrink-0">
                <span className="text-sm text-gray-400 hidden sm:block tabular-nums">
                  {productsLoading
                    ? "..."
                    : `${totalProducts} ${isAr ? "منتج" : "products"}`}
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    <X className="w-3 h-3" />
                    {isAr ? "مسح الكل" : "Clear all"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRODUCT GRID ─────────────────────────────────────── */}
        <section
          ref={productSectionRef}
          className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 py-12"
        >
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 overflow-hidden bg-white animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-4 space-y-2.5">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-28">
              <div className="text-7xl mb-5">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isAr ? "لا توجد منتجات" : "No products found"}
              </h3>
              <p className="text-gray-500 mb-8">
                {isAr
                  ? "حاول تعديل الفلاتر أو مصطلحات البحث"
                  : "Try adjusting your filters or search terms"}
              </p>
              <button
                onClick={clearFilters}
                className="bg-red-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-red-700 transition-colors"
              >
                {isAr ? "مسح الفلاتر" : "Clear Filters"}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-14 flex justify-center items-center gap-2">
                  <button
                    onClick={() => { setPage(Math.max(1, page - 1)); scrollToProducts(); }}
                    disabled={page === 1}
                    className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {isAr ? "السابق" : "Prev"}
                  </button>

                  {getPaginationPages().map((p, idx) =>
                    p === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1.5 text-gray-400">
                        ···
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => { setPage(p as number); scrollToProducts(); }}
                        className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                          p === page
                            ? "bg-red-600 text-white shadow-sm"
                            : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => { setPage(Math.min(totalPages, page + 1)); scrollToProducts(); }}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    {isAr ? "التالي" : "Next"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── CTA BANNER ───────────────────────────────────────── */}
        <section className="bg-gray-900 py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {isAr ? "لم تجد ما تبحث عنه؟" : "Can't find what you need?"}
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              {isAr
                ? "فريقنا مستعد لمساعدتك في الحصول على المعدات المناسبة لعملك"
                : "Our team is ready to help you source the right equipment for your hospitality business"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={isAr ? "/ar/contact" : "/contact"}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
              >
                <Mail className="w-4 h-4" />
                {isAr ? "تواصل معنا" : "Contact Us"}
              </Link>
              <a
                href="tel:+971503079863"
                className="inline-flex items-center gap-2 border-2 border-gray-600 hover:border-white text-white font-bold px-8 py-3.5 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                +971 50 307 9863
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
