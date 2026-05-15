"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/global/Footer";
import { CountryConfig } from "@/lib/countries";
import { ProductWithRelations } from "@/lib/types";
import { getProductImageUrls } from "@/lib/utils";
import { Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { MdOutlineEmail } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";

interface Props {
  country: CountryConfig;
  product: ProductWithRelations;
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

export default function CountryProductPage({ country, product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  const images =
    product.images && product.images.length > 0
      ? getProductImageUrls(product.id, product.images)
      : ["/placeholder.png"];

  const h1 = `${product.name_en} Supplier in ${country.name}`;

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in: ${product.name_en} — for delivery to ${country.name}`,
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
              {product.category && (
                <>
                  <span>›</span>
                  <Link
                    href={`/${country.slug}/${product.category.slug}`}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {product.category.name_en}
                  </Link>
                </>
              )}
              <span>›</span>
              <span className="text-gray-900 font-semibold">{product.name_en}</span>
            </nav>
          </div>
        </div>

        {/* Product detail */}
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4">
                <Image
                  src={images[selectedImage]}
                  alt={product.name_en}
                  fill
                  className="object-contain p-6"
                  priority
                />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white flex items-center justify-center transition-colors ${
                        selectedImage === i ? "border-red-600" : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <Image src={img} alt={`${product.name_en} ${i + 1}`} fill className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {/* Country badge */}
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                <span>{country.flag}</span>
                Available in {country.name}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {h1}
              </h1>

              {/* Brand */}
              {product.brand && (
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  {product.brand.image_path && (
                    <div className="shrink-0 w-16 h-16 relative border border-gray-200 rounded-lg p-1">
                      <Image
                        src={product.brand.image_path}
                        alt={product.brand.name_en}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Brand</p>
                    <Link href={`/${product.brand.slug}`} className="font-bold text-gray-900 hover:text-red-600 transition-colors">
                      {product.brand.name_en}
                    </Link>
                    {product.brand.country_en && (
                      <p className="text-sm text-gray-500 mt-0.5">Made in {product.brand.country_en}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Meta */}
              <dl className="space-y-3 mb-8">
                {product.model && (
                  <div className="flex gap-3">
                    <dt className="text-sm font-semibold text-gray-500 w-24 shrink-0">Model</dt>
                    <dd className="text-sm text-gray-900">{product.model}</dd>
                  </div>
                )}
                {product.category && (
                  <div className="flex gap-3">
                    <dt className="text-sm font-semibold text-gray-500 w-24 shrink-0">Category</dt>
                    <dd className="text-sm text-gray-900">
                      {product.category.name_en}
                      {product.subcategory && ` / ${product.subcategory.name_en}`}
                    </dd>
                  </div>
                )}
                <div className="flex gap-3">
                  <dt className="text-sm font-semibold text-gray-500 w-24 shrink-0">Ships to</dt>
                  <dd className="text-sm text-gray-900">{country.flag} {country.name}</dd>
                </div>
              </dl>

              {/* Shipping note */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                <span className="text-xl">🚢</span>
                <p className="text-green-800 text-sm font-medium">{country.shippingNote}</p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    window.open(
                      `https://api.whatsapp.com/send?phone=971503079863&text=${whatsappMsg}`,
                      "_blank",
                    );
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors"
                >
                  <RiWhatsappFill size={22} />
                  WhatsApp Now
                </button>
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name_en)}&country=${country.name}`}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors"
                >
                  <MdOutlineEmail size={22} />
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Description + Specs */}
        {(product.description_en || (product.specifications && Object.keys(product.specifications).length > 0)) && (
          <div className="border-t border-gray-100 bg-gray-50">
            <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
              {product.description_en && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
                  <div
                    className="text-gray-600 leading-relaxed [&_p]:mb-3"
                    dangerouslySetInnerHTML={{ __html: product.description_en }}
                  />
                </div>
              )}

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex gap-4 border-b border-gray-200 pb-3">
                        <dt className="font-semibold text-gray-700 text-sm uppercase tracking-wide w-40 shrink-0">{key}</dt>
                        <dd className="text-gray-600 text-sm">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ */}
        {country.faq.length > 0 && (
          <section className="py-16 bg-white border-t border-gray-100">
            <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Frequently Asked Questions — {product.category?.name_en ?? "Equipment"} in {country.name}
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
              Ready to order in {country.name}?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              {country.enquiryNote}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`/contact?product=${encodeURIComponent(product.name_en)}&country=${country.name}`}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg"
              >
                <Mail className="w-5 h-5" />
                Send Enquiry
              </Link>
              <a
                href="tel:+971503079863"
                className="inline-flex items-center gap-2 border-2 border-gray-600 hover:border-white text-white font-bold px-8 py-4 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" />
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
