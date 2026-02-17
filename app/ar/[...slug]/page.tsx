"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import Footer from "@/components/global/Footer";
import { MdOutlineEmail } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";
import { getProductImageUrls } from "@/lib/utils";
import {
  ProductWithRelations,
  Brand,
  Category,
  Subcategory,
  SubcategoryWithRelations,
} from "@/lib/types";

interface SlugPageProps {
  params: Promise<{ slug: string[] }>;
}

interface ResolvedContent {
  type: "product" | "brand" | "category" | "subcategory" | "brand-subcategory";
  data?: ProductWithRelations | Brand | Category | Subcategory;
  brand?: Brand;
  subcategory?: SubcategoryWithRelations;
  products?: ProductWithRelations[];
  subcategorySlug?: string;
}

export default function SlugPage({ params }: SlugPageProps) {
  const [content, setContent] = useState<ResolvedContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [subcategoryProducts, setSubcategoryProducts] = useState<
    ProductWithRelations[]
  >([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [subcategoryProductsPage, setSubcategoryProductsPage] = useState(1);
  const [subcategoryProductsTotal, setSubcategoryProductsTotal] = useState(0);
  const [categoryProducts, setCategoryProducts] = useState<
    ProductWithRelations[]
  >([]);
  const [categoryProductsLoading, setCategoryProductsLoading] = useState(true);
  const [categoryProductsPage, setCategoryProductsPage] = useState(1);
  const [categoryProductsTotal, setCategoryProductsTotal] = useState(0);
  const [categorySubcategories, setCategorySubcategories] = useState<
    Subcategory[]
  >([]);
  const [brandProducts, setBrandProducts] = useState<ProductWithRelations[]>(
    [],
  );
  const [brandProductsLoading, setBrandProductsLoading] = useState(true);
  const [brandProductsPage, setBrandProductsPage] = useState(1);
  const [brandProductsTotal, setBrandProductsTotal] = useState(0);
  const [brandSubcategories, setBrandSubcategories] = useState<
    (SubcategoryWithRelations & { productCount?: number })[]
  >([]);
  const [showAllBrandSubcategories, setShowAllBrandSubcategories] =
    useState(false);
  const [brandSubcategoryProducts, setBrandSubcategoryProducts] = useState<
    ProductWithRelations[]
  >([]);
  const [brandSubcategoryProductsLoading, setBrandSubcategoryProductsLoading] =
    useState(false);
  const [brandSubcategoryProductsPage, setBrandSubcategoryProductsPage] =
    useState(1);
  const [brandSubcategoryProductsTotal, setBrandSubcategoryProductsTotal] =
    useState(0);
  const { slug } = use(params);

  const slugPath = Array.isArray(slug) ? slug.join("-") : slug;
  const subcategoryProductsLimit = 12;
  const categoryProductsLimit = 12;
  const brandProductsLimit = 12;
  const brandSubcategoryProductsLimit = 12;
  const initialBrandSubcategoriesShow = 4;

  useEffect(() => {
    const resolveSlug = async () => {
      try {
        const res = await fetch(`/api/resolve-slug?slug=${slugPath}`);
        if (!res.ok) throw new Error("Content not found");
        const data = await res.json();
        setContent(data);
      } catch {
        setError("Content not found");
      } finally {
        setLoading(false);
      }
    };

    resolveSlug();
  }, [slugPath]);

  useEffect(() => {
    if (content?.type === "subcategory") {
      const subcategory = content.data as Subcategory;
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            `/api/products?subcategory=${subcategory.id}&page=${subcategoryProductsPage}&limit=${subcategoryProductsLimit}`,
          );
          if (res.ok) {
            const data = await res.json();
            setSubcategoryProducts(data.products || []);
            setSubcategoryProductsTotal(data.total || 0);
          }
        } catch (err) {
          console.error("Failed to fetch products:", err);
        } finally {
          setProductsLoading(false);
        }
      };

      if (subcategory?.id) {
        fetchProducts();
      }
    }

    if (content?.type === "category") {
      const category = content.data as Category;

      // Fetch subcategories
      const fetchSubcategories = async () => {
        try {
          const res = await fetch(
            `/api/categories/${category.id}/subcategories`,
          );
          if (res.ok) {
            const data = await res.json();
            setCategorySubcategories(data.subcategories || []);
          }
        } catch (err) {
          console.error("Failed to fetch subcategories:", err);
        }
      };

      // Fetch products
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            `/api/products?category=${category.id}&page=${categoryProductsPage}&limit=${categoryProductsLimit}`,
          );
          if (res.ok) {
            const data = await res.json();
            setCategoryProducts(data.products || []);
            setCategoryProductsTotal(data.total || 0);
          }
        } catch (err) {
          console.error("Failed to fetch products:", err);
        } finally {
          setCategoryProductsLoading(false);
        }
      };

      if (category?.id) {
        fetchSubcategories();
        fetchProducts();
      }
    }
  }, [content, subcategoryProductsPage, categoryProductsPage]);

  useEffect(() => {
    if (content?.type === "brand") {
      const brand = content.data as Brand;

      // Fetch subcategories for this brand
      const fetchSubcategories = async () => {
        try {
          const res = await fetch(`/api/brands/${brand.id}/subcategories`);
          if (res.ok) {
            const data = await res.json();
            setBrandSubcategories(data.subcategories || []);
          }
        } catch (err) {
          console.error("Failed to fetch subcategories:", err);
        }
      };

      // Fetch products
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            `/api/products?brand=${brand.id}&page=${brandProductsPage}&limit=${brandProductsLimit}`,
          );
          if (res.ok) {
            const data = await res.json();
            setBrandProducts(data.products || []);
            setBrandProductsTotal(data.total || 0);
          }
        } catch (err) {
          console.error("Failed to fetch products:", err);
        } finally {
          setBrandProductsLoading(false);
        }
      };

      if (brand?.id) {
        fetchSubcategories();
        fetchProducts();
      }
    }
  }, [content, brandProductsPage]);

  useEffect(() => {
    if (
      content?.type === "brand-subcategory" &&
      content.brand &&
      content.subcategory
    ) {
      const fetchProducts = async () => {
        setBrandSubcategoryProductsLoading(true);
        try {
          const res = await fetch(
            `/api/products?brand=${content.brand!.id}&subcategory=${
              content.subcategory!.id
            }&page=${brandSubcategoryProductsPage}&limit=${brandSubcategoryProductsLimit}`,
          );
          if (res.ok) {
            const data = await res.json();
            setBrandSubcategoryProducts(data.products || []);
            setBrandSubcategoryProductsTotal(data.total || 0);
          }
        } catch (err) {
          console.error("Failed to fetch brand-subcategory products:", err);
        } finally {
          setBrandSubcategoryProductsLoading(false);
        }
      };

      fetchProducts();
    }
  }, [content, brandSubcategoryProductsPage]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">جاري التحميل...</p>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{error || "لم يتم العثور على المحتوى"}</p>
      </main>
    );
  }

  // Product page
  if (content.type === "product") {
    const product = content.data as ProductWithRelations;
    const images =
      product.images && product.images.length > 0
        ? getProductImageUrls(product.id, product.images)
        : ["/placeholder.png"];

    return (
      <>
        {/* Breadcrumb Header */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4" dir="rtl">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/ar" className="hover:text-gray-900">
                الرئيسية
              </Link>
              {" › "}
              <Link href="/ar/products" className="hover:text-gray-900">
                المنتجات
              </Link>
              {product.category && (
                <>
                  {" › "}
                  <Link
                    href={`/ar/${product.category.slug}`}
                    className="hover:text-gray-900"
                  >
                    {product.category.name_ar}
                  </Link>
                </>
              )}
              {product.subcategory && (
                <>
                  {" › "}
                  <Link
                    href={`/ar/${product.subcategory.slug}`}
                    className="hover:text-gray-900"
                  >
                    {product.subcategory.name_ar}
                  </Link>
                </>
              )}
              {" › "}
              <span className="text-gray-900 font-semibold">
                {product.name_ar}
              </span>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white" dir="rtl">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Main Content: Image and Details Side by Side (RTL) */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 mb-12">
              {/* Images - Right side for RTL */}
              <div className="lg:order-2">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-white flex items-center justify-center border border-gray-200">
                  {images[selectedImage] && (
                    <Image
                      src={images[selectedImage]}
                      alt={product.name_ar}
                      fill
                      className="object-contain p-4"
                    />
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map(
                      (image, index) =>
                        image && (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative aspect-square overflow-hidden rounded border-2 bg-white flex items-center justify-center ${
                              selectedImage === index
                                ? "border-blue-500"
                                : "border-gray-200"
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`${product.name_ar} ${index + 1}`}
                              fill
                              className="object-contain p-2"
                            />
                          </button>
                        ),
                    )}
                  </div>
                )}
              </div>

              {/* Details - Left side for RTL */}
              <div className="lg:order-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-right">
                  {product.name_ar}
                </h1>

                {product.brand && (
                  <div className="mb-6">
                    <div className="flex flex-row-reverse items-center gap-4">
                      {product.brand.image_path && (
                        <div className="shrink-0">
                          <Image
                            src={product.brand.image_path}
                            alt={product.brand.name_ar}
                            width={80}
                            height={80}
                            className="h-20 w-auto object-contain border border-gray-200 rounded p-2"
                          />
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">
                          البراند
                        </p>
                        <Link
                          href={`/ar/${product.brand.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-red-600"
                        >
                          {product.brand.name_ar}
                        </Link>
                        {product.brand.country_ar && (
                          <p className="text-gray-600 text-sm mt-2">
                            <strong>صنع في:</strong> {product.brand.country_ar}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {product.model && (
                  <p className="text-gray-700 mb-3 text-right">
                    <strong className="text-gray-900">الموديل:</strong>{" "}
                    {product.model}
                  </p>
                )}

                {product.category && (
                  <p className="text-gray-700 mb-6 text-right">
                    <strong className="text-gray-900">الفئة:</strong>{" "}
                    {product.category.name_ar}
                    {product.subcategory && ` / ${product.subcategory.name_ar}`}
                  </p>
                )}

                {/* Fast Shipping Banner */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 flex items-center justify-center gap-3">
                  <span className="text-2xl">🚚</span>
                  <span className="text-gray-900 font-semibold">شحن سريع</span>
                </div>

                {/* Enquiry Buttons - Row reverse for RTL */}
                <div className="flex flex-row-reverse gap-3 mt-8">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition">
                    <MdOutlineEmail size={24} /> استفسر الآن
                  </button>
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition">
                    <RiWhatsappFill size={24} /> واتس أب
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width Description Section - Outside max-w container */}
          <div className="border-t bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              {/* Description */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">
                  الوصف
                </h2>
                <p className="text-gray-700 leading-relaxed text-right">
                  {product.description_ar}
                </p>
              </div>

              {/* Specifications Sidebar */}
              {product.specifications &&
                Object.keys(product.specifications).length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right">
                      المواصفات
                    </h2>
                    <dl className="space-y-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="border-b pb-4">
                            <dt className="font-semibold text-gray-900 text-sm uppercase tracking-wide text-right">
                              {key}
                            </dt>
                            <dd className="text-gray-700 mt-2 text-right">
                              {typeof value === "object"
                                ? JSON.stringify(value)
                                : String(value)}
                            </dd>
                          </div>
                        ),
                      )}
                    </dl>
                  </div>
                )}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Brand page
  if (content.type === "brand") {
    const brand = content.data as Brand;
    return (
      <>
        {/* Breadcrumb Header */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4" dir="rtl">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/ar" className="hover:text-gray-900">
                الرئيسية
              </Link>
              {" › "}
              <span className="text-gray-900 font-semibold">
                {brand.name_ar}
              </span>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white" dir="rtl">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-12 text-right">
              <h1 className="text-4xl font-bold text-gray-900">
                {brand.name_ar}
              </h1>
              {brand.country_ar && (
                <p className="mt-2 text-gray-600">📍 {brand.country_ar}</p>
              )}
              <p className="text-gray-600 mt-4">
                {brandProductsTotal} منتج متاح
              </p>
            </div>

            {/* Popular Products by Type */}
            {brandSubcategories.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-6 text-2xl font-semibold text-gray-900 text-right">
                  المنتجات الشهيرة حسب النوع
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {brandSubcategories
                    .slice(
                      0,
                      showAllBrandSubcategories
                        ? brandSubcategories.length
                        : initialBrandSubcategoriesShow,
                    )
                    .map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/ar/${brand.slug}-${subcategory.slug}`}
                        className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:shadow-md hover:border-blue-500"
                      >
                        {/* Brand Image */}
                        {brand.image_path && (
                          <div className="mb-3 flex items-center justify-center h-16">
                            <Image
                              src={brand.image_path}
                              alt={brand.name_ar}
                              width={64}
                              height={64}
                              className="h-full w-auto object-contain"
                            />
                          </div>
                        )}
                        <span className="font-semibold text-gray-900">
                          {brand.name_ar} {subcategory.name_ar}
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          ({subcategory.productCount}{" "}
                          {subcategory.productCount === 1 ? "منتج" : "منتجات"})
                        </span>
                      </Link>
                    ))}
                </div>

                {/* View More / Show Less Button */}
                {brandSubcategories.length > initialBrandSubcategoriesShow && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() =>
                        setShowAllBrandSubcategories(!showAllBrandSubcategories)
                      }
                      className="inline-block rounded-lg bg-red-600 text-white px-6 py-2 font-medium hover:bg-red-700 transition-colors"
                    >
                      {showAllBrandSubcategories
                        ? `إظهار أقل (${initialBrandSubcategoriesShow} من ${brandSubcategories.length})`
                        : `عرض المزيد (${
                            brandSubcategories.length -
                            initialBrandSubcategoriesShow
                          } المزيد)`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {brandProductsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">جاري تحميل المنتجات...</p>
              </div>
            ) : brandProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                  {brandProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale="ar"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(brandProductsTotal / brandProductsLimit) > 1 && (
                  <div className="flex items-center justify-center gap-2 flex-row-reverse">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setBrandProductsPage(Math.max(1, brandProductsPage - 1))
                      }
                      disabled={brandProductsPage === 1}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      {
                        length: Math.ceil(
                          brandProductsTotal / brandProductsLimit,
                        ),
                      },
                      (_, i) => i + 1,
                    )
                      .filter((p) => {
                        const totalPages = Math.ceil(
                          brandProductsTotal / brandProductsLimit,
                        );
                        return (
                          p === 1 ||
                          p === totalPages ||
                          (p >= brandProductsPage - 1 &&
                            p <= brandProductsPage + 1)
                        );
                      })
                      .map((p, idx, arr) => (
                        <div key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setBrandProductsPage(p)}
                            className={`px-4 py-2 rounded border ${
                              brandProductsPage === p
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setBrandProductsPage(
                          Math.min(
                            Math.ceil(brandProductsTotal / brandProductsLimit),
                            brandProductsPage + 1,
                          ),
                        )
                      }
                      disabled={
                        brandProductsPage ===
                        Math.ceil(brandProductsTotal / brandProductsLimit)
                      }
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">
                  لم يتم العثور على منتجات من هذه العلامة التجارية.
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Category page
  if (content.type === "category") {
    const category = content.data as Category;

    return (
      <>
        {/* Breadcrumb */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4" dir="rtl">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/ar" className="hover:text-gray-900">
                الرئيسية
              </Link>
              {" › "}
              <Link href="/ar/products" className="hover:text-gray-900">
                المنتجات
              </Link>
              {" › "}
              <span className="text-gray-900 font-semibold">
                {category.name_ar}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-gray-50 py-12 px-4" dir="rtl">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {category.name_ar}
              </h1>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-1 bg-red-600"></div>
              </div>
              <p className="text-lg text-gray-600">
                {categoryProductsTotal} منتج متاح
              </p>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white" dir="rtl">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-12 text-right">
              <h1 className="text-4xl font-bold text-gray-900">
                {category.name_ar}
              </h1>
              <p className="text-gray-600 mt-4">
                {categoryProductsTotal} منتج متاح
              </p>
            </div>

            {/* Subcategories Filter */}
            {categorySubcategories.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 text-right">
                  التصفية حسب الفئة الفرعية
                </h2>
                <div className="flex flex-wrap gap-2 justify-end">
                  <Link
                    href={`/ar/${(content.data as Category).slug}`}
                    className={`rounded-full px-4 py-2 font-medium transition-colors ${
                      slugPath === (content.data as Category).slug
                        ? "bg-red-600 text-white"
                        : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    الكل
                  </Link>
                  {categorySubcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      href={`/ar/${subcategory.slug}`}
                      className={`rounded-full px-4 py-2 font-medium transition-colors ${
                        slugPath === subcategory.slug
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {subcategory.name_ar}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {categoryProductsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">جاري تحميل المنتجات...</p>
              </div>
            ) : categoryProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale="ar"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(categoryProductsTotal / categoryProductsLimit) >
                  1 && (
                  <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setCategoryProductsPage(
                          Math.max(1, categoryProductsPage - 1),
                        )
                      }
                      disabled={categoryProductsPage === 1}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      {
                        length: Math.ceil(
                          categoryProductsTotal / categoryProductsLimit,
                        ),
                      },
                      (_, i) => i + 1,
                    )
                      .filter((p) => {
                        const totalPages = Math.ceil(
                          categoryProductsTotal / categoryProductsLimit,
                        );
                        return (
                          p === 1 ||
                          p === totalPages ||
                          (p >= categoryProductsPage - 1 &&
                            p <= categoryProductsPage + 1)
                        );
                      })
                      .map((p, idx, arr) => (
                        <div key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setCategoryProductsPage(p)}
                            className={`px-4 py-2 rounded border ${
                              categoryProductsPage === p
                                ? "bg-red-600 text-white border-red-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setCategoryProductsPage(
                          Math.min(
                            Math.ceil(
                              categoryProductsTotal / categoryProductsLimit,
                            ),
                            categoryProductsPage + 1,
                          ),
                        )
                      }
                      disabled={
                        categoryProductsPage ===
                        Math.ceil(categoryProductsTotal / categoryProductsLimit)
                      }
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">
                  لم يتم العثور على منتجات في هذه الفئة.
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Subcategory page
  if (content.type === "subcategory") {
    const subcategory = content.data as SubcategoryWithRelations;

    return (
      <>
        {/* Breadcrumb Header */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4" dir="rtl">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/ar" className="hover:text-gray-900">
                الرئيسية
              </Link>
              {" › "}
              <Link href="/ar/products" className="hover:text-gray-900">
                المنتجات
              </Link>
              {subcategory.category && (
                <>
                  {" › "}
                  <Link
                    href={`/ar/${subcategory.category.slug}`}
                    className="hover:text-gray-900"
                  >
                    {subcategory.category.name_ar}
                  </Link>
                </>
              )}
              {" › "}
              <span className="text-gray-900 font-semibold">
                {subcategory.name_ar}
              </span>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white" dir="rtl">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-12 text-right">
              <h1 className="text-4xl font-bold text-gray-900">
                {subcategory.name_ar}
              </h1>
              <p className="text-gray-600 mt-4">
                {subcategoryProductsTotal} منتج متاح
              </p>
            </div>

            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">جاري تحميل المنتجات...</p>
              </div>
            ) : subcategoryProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                  {subcategoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale="ar"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(
                  subcategoryProductsTotal / subcategoryProductsLimit,
                ) > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setSubcategoryProductsPage(
                          Math.max(1, subcategoryProductsPage - 1),
                        )
                      }
                      disabled={subcategoryProductsPage === 1}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      {
                        length: Math.ceil(
                          subcategoryProductsTotal / subcategoryProductsLimit,
                        ),
                      },
                      (_, i) => i + 1,
                    )
                      .filter((p) => {
                        const totalPages = Math.ceil(
                          subcategoryProductsTotal / subcategoryProductsLimit,
                        );
                        return (
                          p === 1 ||
                          p === totalPages ||
                          (p >= subcategoryProductsPage - 1 &&
                            p <= subcategoryProductsPage + 1)
                        );
                      })
                      .map((p, idx, arr) => (
                        <div key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setSubcategoryProductsPage(p)}
                            className={`px-4 py-2 rounded border ${
                              subcategoryProductsPage === p
                                ? "bg-blue-500 text-white border-blue-500"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setSubcategoryProductsPage(
                          Math.min(
                            Math.ceil(
                              subcategoryProductsTotal /
                                subcategoryProductsLimit,
                            ),
                            subcategoryProductsPage + 1,
                          ),
                        )
                      }
                      disabled={
                        subcategoryProductsPage ===
                        Math.ceil(
                          subcategoryProductsTotal / subcategoryProductsLimit,
                        )
                      }
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">
                  لم يتم العثور على منتجات في هذه الفئة.
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Brand + Subcategory page
  if (
    content.type === "brand-subcategory" &&
    content.brand &&
    content.products
  ) {
    return (
      <>
        {/* Breadcrumb Header */}
        <div className="bg-gray-100 border-t-4 border-gray-300 py-4" dir="rtl">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
            <div className="text-sm text-gray-600">
              <Link href="/ar" className="hover:text-gray-900">
                الرئيسية
              </Link>
              {" › "}
              <Link
                href={`/ar/${content.brand?.slug}`}
                className="hover:text-gray-900"
              >
                {content.brand?.name_ar}
              </Link>
              {" › "}
              <span className="text-gray-900 font-semibold">
                {content.subcategory?.name_ar}
              </span>
            </div>
          </div>
        </div>

        <main className="min-h-screen bg-white" dir="rtl">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-12 text-right">
              <h1 className="text-4xl font-bold text-gray-900">
                {content.brand?.name_ar} {content.subcategory?.name_ar}
              </h1>
              <p className="text-gray-600 mt-4">
                {brandSubcategoryProductsTotal} منتج متاح
              </p>
            </div>

            {brandSubcategoryProductsLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">جاري تحميل المنتجات...</p>
              </div>
            ) : brandSubcategoryProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                  {brandSubcategoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale="ar"
                    />
                  ))}
                </div>

                {/* Pagination */}
                {Math.ceil(
                  brandSubcategoryProductsTotal / brandSubcategoryProductsLimit,
                ) > 1 && (
                  <div className="flex items-center justify-center gap-2 flex-row-reverse">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setBrandSubcategoryProductsPage(
                          Math.max(1, brandSubcategoryProductsPage - 1),
                        )
                      }
                      disabled={brandSubcategoryProductsPage === 1}
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>

                    {/* Page Numbers */}
                    {Array.from(
                      {
                        length: Math.ceil(
                          brandSubcategoryProductsTotal /
                            brandSubcategoryProductsLimit,
                        ),
                      },
                      (_, i) => i + 1,
                    )
                      .filter((p) => {
                        const totalPages = Math.ceil(
                          brandSubcategoryProductsTotal /
                            brandSubcategoryProductsLimit,
                        );
                        return (
                          p === 1 ||
                          p === totalPages ||
                          (p >= brandSubcategoryProductsPage - 1 &&
                            p <= brandSubcategoryProductsPage + 1)
                        );
                      })
                      .map((p, idx, arr) => (
                        <div key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => setBrandSubcategoryProductsPage(p)}
                            className={`px-4 py-2 rounded border ${
                              brandSubcategoryProductsPage === p
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      ))}

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setBrandSubcategoryProductsPage(
                          Math.min(
                            Math.ceil(
                              brandSubcategoryProductsTotal /
                                brandSubcategoryProductsLimit,
                            ),
                            brandSubcategoryProductsPage + 1,
                          ),
                        )
                      }
                      disabled={
                        brandSubcategoryProductsPage ===
                        Math.ceil(
                          brandSubcategoryProductsTotal /
                            brandSubcategoryProductsLimit,
                        )
                      }
                      className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">
                  لم يتم العثور على منتجات لهذه العلامة والفئة الفرعية.
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return null;
}
