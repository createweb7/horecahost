"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { getProductImageUrls } from "@/lib/utils";
import EnquiryForm from "@/components/enquiry/EnquiryForm";
import {
  ProductWithRelations,
} from "@/lib/types";

interface ProductDetailPageProps {
  params: { slug: string };
}

export default function ProductDetailClient({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reset and scroll on route change
  useEffect(() => {
    setLoading(true);
    setProduct(null);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [params.slug]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [params.slug]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        // Scroll to top after data loads
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </main>
    );
  }

  const displayPrice = product.discount_price || product.price;
  const originalPrice = product.discount_price ? product.price : null;
  const images = product.images && product.images.length > 0
    ? getProductImageUrls(product.id, product.images)
    : ["/placeholder.png"];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <a href="/products" className="hover:text-gray-700">
            Products
          </a>
          {product.category && (
            <>
              {" / "}
              <span>{product.category.name_en}</span>
            </>
          )}
          {" / "}
          <span className="text-gray-900">{product.name_en}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-white flex items-center justify-center border border-gray-200">
              <Image
                src={images[selectedImage]}
                alt={product.name_en}
                fill
                className="object-contain p-4"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded border-2 bg-white flex items-center justify-center ${
                      selectedImage === index ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name_en} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brand.name_en}</p>
            )}

            {/* Name */}
            <h1 className="mt-2 text-4xl font-bold text-gray-900">{product.name_en}</h1>

            {/* Model */}
            {product.model && (
              <p className="mt-2 text-gray-600"><strong>Model:</strong> {product.model}</p>
            )}

            {/* Category */}
            {product.category && (
              <p className="mt-2 text-gray-600"><strong>Category:</strong> {product.category.name_en}{product.subcategory && ` / ${product.subcategory.name_en}`}</p>
            )}

            {/* Price */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">${displayPrice.toFixed(2)}</span>
              {originalPrice && <span className="text-xl text-gray-400 line-through">${originalPrice.toFixed(2)}</span>}
              {product.discount_price && (
                <span className="rounded bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">-
                  {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Description</h2>
              <div className="mt-4 text-gray-600 leading-relaxed space-y-3">
                {product.description_en
                  ?.replace(/<\/?p>/g, '') // Remove all <p> and </p> tags
                  .split('•')
                  .filter(line => line.trim())
                  .map((line, index) => (
                    <p key={index} className="text-sm">{line.trim()}</p>
                  ))}
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900">Specifications</h2>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}><dt className="font-semibold text-gray-900">{key}</dt><dd className="text-gray-600">{typeof value === "object" ? JSON.stringify(value) : String(value)}</dd></div>
                  ))}
                </dl>
              </div>
            )}

            {/* Add to Cart Button */}
            <button className="mt-8 w-full rounded-lg bg-blue-600 px-8 py-3 text-center font-semibold text-white hover:bg-blue-700 transition">Add to Cart</button>
          </div>
        </div>

        {/* Enquiry Form Section */}
        <div className="mt-16 border-t pt-12">
          <EnquiryForm 
            productName={product.name_en || product.name_ar}
            productSlug={product.slug}
            productPrice={product.discount_price || product.price}
          />
        </div>
      </div>
    </main>
  );
}
