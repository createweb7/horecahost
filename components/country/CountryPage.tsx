import Link from "next/link";
import Footer from "@/components/global/Footer";
import { CountryConfig } from "@/lib/countries";
import { Phone, Mail, ArrowRight, CheckCircle, Package, Star } from "lucide-react";

interface Props {
  country: CountryConfig;
}

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

export default function CountryPage({ country }: Props) {
  return (
    <>
      <main className="min-h-screen bg-white">

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section className="relative bg-gray-900 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 pt-6 pb-20 sm:pb-28">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-8">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-300">
                {country.flag} {country.name}
              </span>
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
                  href="/products"
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

        {/* ── INTRO ────────────────────────────────────────────── */}
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
                    <p key={i} className="text-gray-600 leading-relaxed text-base">
                      {para}
                    </p>
                  ))}
                </div>
                <div className="mt-8 p-5 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-red-700 text-sm font-semibold flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    {country.shippingNote}
                  </p>
                </div>
              </div>

              {/* Why us cards */}
              <div className="space-y-5">
                {country.whyUs.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-5 p-6 rounded-2xl border border-gray-100 bg-gray-50 hover:border-red-200 hover:bg-red-50/30 transition-all"
                  >
                    <div className="text-3xl shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 text-lg">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
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
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {industry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCT CATEGORIES ───────────────────────────────── */}
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  Equipment We Supply to {country.name}
                </h2>
                <div className="w-14 h-1 bg-red-600 rounded-full" />
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors group"
              >
                View all products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Commercial Kitchen Equipment",
                  desc: "Cooking ranges, ovens, fryers, grills, steamers and more for professional kitchens",
                  icon: "🍳",
                  href: "/products",
                },
                {
                  name: "Refrigeration & Cold Chain",
                  desc: "Commercial refrigerators, freezers, blast chillers, and cold room solutions",
                  icon: "❄️",
                  href: "/products",
                },
                {
                  name: "Food Preparation Equipment",
                  desc: "Mixers, slicers, processors, and prep equipment for high-volume kitchens",
                  icon: "🔪",
                  href: "/products",
                },
                {
                  name: "Bakery & Pastry Equipment",
                  desc: "Professional ovens, proofers, dough sheeters for bakeries and pastry kitchens",
                  icon: "🥐",
                  href: "/products",
                },
                {
                  name: "Warewashing & Hygiene",
                  desc: "Commercial dishwashers, glasswashers, and sanitation equipment",
                  icon: "✨",
                  href: "/products",
                },
                {
                  name: "Bar & Beverage Equipment",
                  desc: "Coffee machines, juice extractors, ice makers, and bar equipment",
                  icon: "☕",
                  href: "/products",
                },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group flex gap-4 p-6 rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all bg-white"
                >
                  <div className="text-3xl shrink-0">{cat.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRANDS STRIP ─────────────────────────────────────── */}
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 text-center">
            <div className="flex items-center gap-3 justify-center mb-8">
              <Star className="w-4 h-4 text-red-600 fill-red-600" />
              <p className="text-gray-500 font-semibold uppercase tracking-widest text-xs">
                Trusted Global Brands Available in {country.name}
              </p>
              <Star className="w-4 h-4 text-red-600 fill-red-600" />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Rational", "Electrolux", "Hobart", "Meiko",
                "Fagor", "Henny Penny", "Manitowoc", "True",
                "Scotsman", "Robot Coupe", "Dito Sama", "Welbilt",
              ].map((brand) => (
                <Link
                  key={brand}
                  href="/brands"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:border-red-300 hover:text-red-600 transition-all"
                >
                  {brand}
                </Link>
              ))}
            </div>
            <Link
              href="/brands"
              className="inline-flex items-center gap-2 mt-8 text-red-600 font-semibold hover:text-red-700 transition-colors"
            >
              View all 60+ brands
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section className="relative bg-gray-900 py-20 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Equip Your {country.name} Property?
              </h2>
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
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
                  href="tel:+971503079863"
                  className="inline-flex items-center gap-2 border-2 border-gray-600 hover:border-white text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg"
                >
                  <Phone className="w-5 h-5" />
                  +971 50 307 9863
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
