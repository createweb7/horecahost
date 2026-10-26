"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";
import Footer from "@/components/global/Footer";
import type { BrandWithMeta } from "./page";

interface BrandsPageClientProps {
  initialBrands: BrandWithMeta[];
  featuredBrands: BrandWithMeta[];
}

const PAGE_SIZE = 12;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function BrandsPageClient({
  initialBrands,
  featuredBrands,
}: BrandsPageClientProps) {
  const [brands] = useState<BrandWithMeta[]>(initialBrands);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const set = new Set<string>();
    brands.forEach((b) => {
      if (b.primaryCategory) set.add(b.primaryCategory);
    });
    return Array.from(set).sort();
  }, [brands]);

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    brands.forEach((b) => set.add(b.name_en.trim().charAt(0).toUpperCase()));
    return set;
  }, [brands]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return brands.filter((b) => {
      if (selectedCategory && b.primaryCategory !== selectedCategory) return false;
      if (selectedLetter && b.name_en.trim().charAt(0).toUpperCase() !== selectedLetter) return false;
      if (q && !b.name_en.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [brands, search, selectedCategory, selectedLetter]);

  const visible = filtered.slice(0, visibleCount);

  const updateFilter = (fn: () => void) => {
    fn();
    setVisibleCount(PAGE_SIZE);
  };

  const marqueeLogos = useMemo(() => {
    const withLogos = brands.filter((b): b is BrandWithMeta & { image_path: string } => !!b.image_path);
    return [...withLogos, ...withLogos];
  }, [brands]);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            {" › "}
            <span className="text-gray-900 font-semibold">Brands</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gray-50 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-0.5 bg-red-600" />
                <span className="text-xs font-semibold tracking-widest text-red-600 uppercase">
                  Our Brands · Authorised Partners
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Equipment from the names{" "}
                <span className="text-red-600">chefs trust.</span>
              </h1>
            </div>
            <div className="space-y-3">
              <p className="text-sm sm:text-base text-gray-600">
                Commercial kitchen and coffee equipment from leading
                manufacturers — specified, supplied and supported by one team.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  document.getElementById("directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-full pl-4 pr-1.5 py-1.5"
              >
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => updateFilter(() => setSearch(e.target.value))}
                  placeholder="Frymaster, Gaggia, Hatco..."
                  className="flex-1 min-w-0 text-sm focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  Browse
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      {marqueeLogos.length > 0 && (
        <div
          aria-hidden="true"
          className="bg-white border-y border-gray-200 py-6 overflow-hidden whitespace-nowrap"
        >
          <div className="hh-marquee-track">
            {marqueeLogos.map((brand, i) => (
              <span key={`${brand.id}-${i}`} className="flex items-center pr-16 shrink-0">
                <Image
                  src={brand.image_path}
                  alt={brand.name_en}
                  width={120}
                  height={48}
                  className="h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200"
                />
              </span>
            ))}
          </div>
        </div>
      )}

      <main className="bg-white">
        {/* Featured partners */}
        {featuredBrands.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 sm:px-8 py-14 sm:py-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Featured partners
              </h2>
              <p className="text-sm text-gray-500 max-w-sm">
                Lines we stock in depth, with demo units and spare parts on
                hand.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featuredBrands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/${brand.slug}`}
                  className="group block bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-56 sm:h-64 bg-white flex items-center justify-center p-10">
                    {brand.primaryCategory && (
                      <span className="absolute top-4 left-4 text-xs font-semibold tracking-widest text-gray-600 uppercase border border-gray-300 rounded-full px-3 py-1">
                        {brand.primaryCategory}
                      </span>
                    )}
                    <Image
                      src={brand.image_path!}
                      alt={brand.name_en}
                      width={240}
                      height={160}
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{brand.name_en}</p>
                      <p className="text-sm text-gray-500">
                        {brand.productCount} {brand.productCount === 1 ? "product" : "products"} available
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-red-600 shrink-0">
                      Explore range
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Directory */}
        <section id="directory" className="bg-gray-50 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                All brands <span className="text-gray-400 font-normal">A–Z</span>
              </h2>
              <p className="text-sm text-gray-500">
                {filtered.length} {filtered.length === 1 ? "brand" : "brands"}
                {search || selectedCategory || selectedLetter ? " matching" : ""}
              </p>
            </div>

            {/* Toolbar */}
            <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-y border-gray-200 py-3 mb-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateFilter(() => setSelectedCategory(null))}
                    className={`h-9 px-4 rounded-full text-sm font-medium border transition-colors ${
                      selectedCategory === null
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 text-gray-700 hover:bg-white"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => updateFilter(() => setSelectedCategory(cat))}
                      className={`h-9 px-4 rounded-full text-sm font-medium border transition-colors ${
                        selectedCategory === cat
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-300 text-gray-700 hover:bg-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-gray-200 rounded-full p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                    className={`w-9 h-8 rounded-full flex items-center justify-center transition-colors ${
                      view === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    aria-label="List view"
                    aria-pressed={view === "list"}
                    className={`w-9 h-8 rounded-full flex items-center justify-center transition-colors ${
                      view === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => updateFilter(() => setSelectedLetter(null))}
                  className={`min-w-8 h-8 px-2 rounded-md text-xs font-bold transition-colors ${
                    selectedLetter === null
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-white"
                  }`}
                >
                  All
                </button>
                {LETTERS.map((letter) => {
                  const disabled = !availableLetters.has(letter);
                  return (
                    <button
                      key={letter}
                      type="button"
                      disabled={disabled}
                      onClick={() => updateFilter(() => setSelectedLetter(letter))}
                      className={`min-w-8 h-8 px-2 rounded-md text-xs font-bold transition-colors ${
                        selectedLetter === letter
                          ? "bg-red-600 text-white"
                          : disabled
                          ? "text-gray-300 cursor-default"
                          : "text-gray-700 hover:bg-white"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results */}
            {visible.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-gray-300 rounded-2xl">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  No brands match that.
                </p>
                <p className="text-sm text-gray-500 mb-5">
                  Looking for something specific? We can source it.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    updateFilter(() => {
                      setSearch("");
                      setSelectedCategory(null);
                      setSelectedLetter(null);
                    })
                  }
                  className="inline-flex items-center gap-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {visible.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/${brand.slug}`}
                    className="group bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-lg hover:border-gray-300 transition-all flex flex-col"
                  >
                    <div className="relative h-28 sm:h-36 flex items-center justify-center mb-3">
                      {brand.primaryCategory && (
                        <span className="absolute top-0 left-0 text-[10px] font-semibold tracking-wide text-gray-500 uppercase bg-gray-100 rounded px-1.5 py-0.5">
                          {brand.primaryCategory}
                        </span>
                      )}
                      {brand.image_path ? (
                        <Image
                          src={brand.image_path}
                          alt={brand.name_en}
                          width={160}
                          height={120}
                          className="object-contain w-full h-full p-2"
                        />
                      ) : (
                        <span className="font-bold text-gray-900 text-center">{brand.name_en}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-3 mt-auto">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{brand.name_en}</p>
                        <p className="text-xs text-gray-500">{brand.productCount} products</p>
                      </div>
                      <span className="shrink-0 w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-colors">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-200 bg-white rounded-lg border border-gray-200 overflow-hidden">
                {visible.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/${brand.slug}`}
                    className="group grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[48px_minmax(0,2fr)_1fr_1fr_40px] items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    <span className="hidden sm:block text-xs font-semibold text-gray-400">
                      {String(brands.indexOf(brand) + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold text-gray-900 truncate">{brand.name_en}</span>
                    <span className="hidden sm:block text-xs font-semibold tracking-wide text-gray-500 uppercase">
                      {brand.primaryCategory || "—"}
                    </span>
                    <span className="hidden sm:block text-sm text-gray-500">
                      {brand.productCount} products
                    </span>
                    <span className="shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Load more */}
            {visible.length < filtered.length && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {visible.length} of {filtered.length} brands
                </p>
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors"
                >
                  Load more brands
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Services */}
        <section className="mx-auto max-w-7xl px-6 sm:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 border-t border-gray-900">
            {[
              {
                n: "01",
                title: "Sourcing & supply",
                desc: "Genuine equipment from each manufacturer, matched to your menu and volume.",
              },
              {
                n: "02",
                title: "Installation",
                desc: "Delivered, installed and commissioned by technicians who know the equipment.",
              },
              {
                n: "03",
                title: "After-sales service",
                desc: "Maintenance, spare parts and support long after the kitchen opens.",
              },
            ].map((item, i) => (
              <div
                key={item.n}
                className={`pt-8 sm:py-8 ${i < 2 ? "sm:border-r border-gray-200" : ""} ${
                  i === 0 ? "sm:pr-8" : i === 2 ? "sm:pl-8" : "sm:px-8"
                }`}
              >
                <p className="text-xs font-bold text-red-600 mb-6">{item.n}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 sm:px-8 pb-14 sm:pb-20">
          <div className="bg-red-600 rounded-2xl p-8 sm:p-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-xl">
              Planning a new kitchen? Start with a plan.
            </h2>
            <div className="space-y-4 max-w-sm">
              <p className="text-sm text-red-50">
                Our kitchen consultants design layouts and specify the right
                brands for your space and budget.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/kitchen-consultancy#consultation-form"
                  className="bg-white text-red-600 hover:bg-gray-50 font-semibold text-sm px-5 py-3 rounded-full transition-colors"
                >
                  Book a consultation
                </Link>
                <Link
                  href="/contact"
                  className="border border-white text-white hover:bg-red-700 font-semibold text-sm px-5 py-3 rounded-full transition-colors"
                >
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
