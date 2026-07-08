import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/global/Footer";
import ProductCard from "@/components/products/ProductCard";
import { CountryConfig, DEFAULT_PHONE, DEFAULT_PHONE_DISPLAY } from "@/lib/countries";
import { ProductWithRelations, Brand } from "@/lib/types";
import { Phone, Mail, ArrowRight, CheckCircle, Package } from "lucide-react";

interface Props {
  country: CountryConfig;
  products: ProductWithRelations[];
  brands: Brand[];
}

export default function CountryPage({ country, products, brands }: Props) {
  return (
    <>
      <main className="min-h-screen bg-white">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative bg-gray-900 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 pt-6 pb-20 sm:pb-28">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-300">{country.flag} {country.name}</span>
            </nav>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                <span>{country.flag}</span>
                Serving {country.name}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                {country.heroTitle}
              </h1>

              <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-3xl">
                {country.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/${country.slug}/products`}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
                >
                  <Package className="w-4 h-4" />
                  Browse Products
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border-2 border-gray-600 hover:border-white text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Get a Quote
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 flex flex-wrap gap-10">
              <div>
                <div className="text-3xl font-black text-white">60+</div>
                <div className="text-gray-500 text-sm mt-1 uppercase tracking-wider">Global Brands</div>
              </div>
              <div className="w-px bg-gray-800 hidden sm:block" />
              <div>
                <div className="text-3xl font-black text-white">500+</div>
                <div className="text-gray-500 text-sm mt-1 uppercase tracking-wider">Products</div>
              </div>
              <div className="w-px bg-gray-800 hidden sm:block" />
              <div>
                <div className="text-3xl font-black text-white">25+</div>
                <div className="text-gray-500 text-sm mt-1 uppercase tracking-wider">Years Experience</div>
              </div>
              <div className="w-px bg-gray-800 hidden sm:block" />
              <div>
                <div className="text-3xl font-black text-red-500">{country.flag}</div>
                <div className="text-gray-500 text-sm mt-1 uppercase tracking-wider">Shipping to {country.name}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTRO + WHY US ───────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Your Trusted Hospitality Equipment Partner in{" "}
                  <span className="text-red-600">{country.name}</span>
                </h2>
                <div className="w-14 h-1 bg-red-600 rounded-full mb-8" />
                <div className="space-y-5">
                  {country.intro.map((para, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">{para}</p>
                  ))}
                </div>
                <div className="mt-8 p-5 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-red-700 text-sm font-semibold flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {country.shippingNote}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {country.whyUs.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-5 p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:border-red-200 hover:bg-red-50/30 transition-all"
                  >
                    <div className="text-3xl shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-lg">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── INDUSTRIES ───────────────────────────────────────── */}
        <section className="py-20 bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Industries We Serve in {country.name}
              </h2>
              <div className="flex justify-center">
                <div className="w-14 h-1 bg-red-600 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {country.industries.map((industry, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 p-7 text-center hover:border-red-300 hover:shadow-lg transition-all group"
                >
                  <div className="text-5xl mb-4">{industry.icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-red-600 transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{industry.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REAL PRODUCTS ────────────────────────────────────── */}
        {products.length > 0 && (
          <section className="py-20 bg-white border-t border-gray-100">
            <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                    Equipment Available in {country.name}
                  </h2>
                  <div className="w-14 h-1 bg-red-600 rounded-full" />
                </div>
                <Link
                  href={`/${country.slug}/products`}
                  className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors group shrink-0"
                >
                  View all products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} locale="en" href={`/${country.slug}/${product.slug}`} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── REAL BRANDS ──────────────────────────────────────── */}
        {brands.length > 0 && (
          <section className="py-20 bg-gray-50 border-t border-gray-100">
            <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
              <div className="text-center mb-12">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Trusted Global Brands Available in {country.name}
                </p>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  60+ World-Class Brands
                </h2>
                <div className="flex justify-center">
                  <div className="w-14 h-1 bg-red-600 rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/${country.slug}/${brand.slug}`}
                    className="group bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-center hover:border-red-300 hover:shadow-md transition-all aspect-square"
                    title={brand.name_en}
                  >
                    {brand.image_path ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={brand.image_path}
                          alt={brand.name_en}
                          fill
                          className="object-contain p-1"
                          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 12vw"
                        />
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-gray-600 text-center group-hover:text-red-600 transition-colors line-clamp-2">
                        {brand.name_en}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/brands"
                  className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors"
                >
                  View all brands
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="relative bg-gray-900 py-20 overflow-hidden">
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
              Ready to Equip Your {country.name} Property?
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
              {country.enquiryNote}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg text-lg"
              >
                <Mail className="w-5 h-5" />
                Send Enquiry
              </Link>
              <a
                href={`tel:${country.phone || DEFAULT_PHONE}`}
                className="inline-flex items-center gap-2 border-2 border-gray-600 hover:border-white text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg"
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
