"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/global/Footer";
import ProductCard from "@/components/products/ProductCard";
import { CountryConfig, DEFAULT_PHONE, DEFAULT_PHONE_DISPLAY } from "@/lib/countries";
import { ProductWithRelations, Brand } from "@/lib/types";
import { Mail, Phone, ChevronDown, ChevronUp, ArrowRight, Package } from "lucide-react";

interface Props {
  country: CountryConfig;
  brand: Brand;
  products: ProductWithRelations[];
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-red-600 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function CountryBrandPage({ country, brand, products }: Props) {
  const h1 = `${brand.name_en} Equipment Supplier in ${country.name}`;

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in ${brand.name_en} equipment for delivery to ${country.name}`,
  );

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-100 border-t-4 border-red-600 py-4">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <nav className="text-sm text-gray-600 flex flex-wrap gap-1 items-center">
              <Link href={`/${country.slug}`} className="hover:text-gray-900 transition-colors">
                {country.flag} {country.name}
              </Link>
              <span>›</span>
              <Link href="/brands" className="hover:text-gray-900 transition-colors">Brands</Link>
              <span>›</span>
              <span className="text-gray-900 font-semibold">{brand.name_en}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="relative bg-gray-900 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 pt-10 pb-20 sm:pb-24">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
              {/* Brand logo */}
              {brand.image_path && (
                <div className="shrink-0 w-28 h-28 bg-white rounded-2xl border border-gray-200 flex items-center justify-center p-3">
                  <Image
                    src={brand.image_path}
                    alt={brand.name_en}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
              )}

              <div>
                <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  <span>{country.flag}</span>
                  {country.name}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
                  {h1}
                </h1>
                {brand.country_en && (
                  <p className="text-gray-400 text-base">
                    Made in {brand.country_en} · {products.length > 0 ? `${products.length}+ products` : "Available to order"} · Ships to {country.name}
                  </p>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href={`https://api.whatsapp.com/send?phone=${(country.phone || DEFAULT_PHONE).replace("+", "")}&text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
              >
                WhatsApp Now
              </a>
              <Link
                href={`/contact?brand=${encodeURIComponent(brand.name_en)}&country=${country.name}`}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-xl transition-colors"
              >
                <Mail className="w-4 h-4" />
                Request Quote
              </Link>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {brand.name_en} Products Available in {country.name}
                </h2>
                <div className="w-12 h-1 bg-red-600 rounded-full" />
              </div>
              <Link
                href={`/${country.slug}/products`}
                className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors group shrink-0"
              >
                View all products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale="en"
                    href={`/${country.slug}/${product.slug}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium text-gray-500">Products coming soon</p>
                <p className="text-sm mt-1">Contact us to enquire about {brand.name_en} equipment for {country.name}.</p>
              </div>
            )}
          </div>
        </section>

        {/* Shipping note */}
        <div className="bg-green-50 border-y border-green-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 py-5 flex items-center gap-3">
            <span className="text-2xl">🚢</span>
            <p className="text-green-800 font-medium">{country.shippingNote}</p>
          </div>
        </div>

        {/* FAQ */}
        {country.faq.length > 0 && (
          <section className="py-16 bg-white border-t border-gray-100">
            <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Frequently Asked Questions — {brand.name_en} in {country.name}
              </h2>
              <div className="w-12 h-1 bg-red-600 rounded-full mb-8" />
              <div className="space-y-3 max-w-3xl">
                {country.faq.map((item, i) => (
                  <FAQItem key={i} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative bg-gray-900 py-16 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Need {brand.name_en} Equipment in {country.name}?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              {country.enquiryNote}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`/contact?brand=${encodeURIComponent(brand.name_en)}&country=${country.name}`}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
              >
                <Mail className="w-5 h-5" />
                Send Enquiry
              </Link>
              <a
                href={`tel:${country.phone || DEFAULT_PHONE}`}
                className="inline-flex items-center gap-2 border-2 border-gray-600 hover:border-white text-white font-bold px-8 py-4 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" />
                {country.phoneDisplay || DEFAULT_PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
