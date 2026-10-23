"use client";

import Link from "next/link";
import Image from "next/image";
import { Download, ArrowRight, Check } from "lucide-react";
import Footer from "@/components/global/Footer";

const STATS = [
  { value: "25", suffix: "+", label: "Years in the HORECA sector" },
  { value: "60", suffix: "+", label: "Global brands in our portfolio" },
  { value: "8", suffix: "", label: "Countries we serve" },
  { value: "One", suffix: "", label: "Standard of excellence" },
];

const PILLARS = [
  {
    num: "01",
    title: "The factory-to-customer advantage",
    description:
      "We buy direct from manufacturers and deliver to your door with full manufacturer warranties — no unnecessary middlemen.",
    bullets: [
      "Better value — your budget goes into the machine, not the supply chain.",
      "Direct accountability — authentic products, clear support channels.",
    ],
  },
  {
    num: "02",
    title: "A curator of global excellence",
    description:
      "Two decades of vetting the market have shaped a portfolio of 60+ global brands — from precision Italian espresso machines to heavy-duty German refrigeration.",
    link: { href: "/brands", label: "Explore our brands" },
  },
  {
    num: "03",
    title: "Kitchen design & consultancy",
    description:
      "Our consultants turn culinary vision into a working kitchen — planning, equipment recommendations, technical drawings and end-to-end support for restaurants, hotels, cafés and caterers.",
    link: { href: "/kitchen-consultancy", label: "About Kitchen Consultancy" },
  },
];

const COUNTRIES = [
  { country: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { country: "United States", code: "US", flag: "🇺🇸" },
  { country: "Malaysia", code: "MY", flag: "🇲🇾" },
  { country: "Italy", code: "IT", flag: "🇮🇹" },
  { country: "Mauritius", code: "MU", flag: "🇲🇺" },
  { country: "Bahrain", code: "BH", flag: "🇧🇭" },
  { country: "Qatar", code: "QA", flag: "🇶🇦" },
  { country: "India", code: "IN", flag: "🇮🇳" },
];

export default function AboutPageClient() {
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
            <span className="text-gray-900 font-semibold">About Us</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 py-10 sm:py-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-0.5 bg-red-600" />
            <span className="text-xs font-semibold tracking-widest text-red-600 uppercase">
              About Horeca Host · The engine behind world-class hospitality
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-4xl">
            We don&apos;t just supply kitchens.{" "}
            <span className="text-red-600">We build businesses.</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <a
              href="/downloads/HorecaHost-Company-Profile.pdf"
              download
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-full transition-colors"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Company profile (PDF)
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-900 hover:bg-white font-semibold text-sm sm:text-base px-5 py-3 rounded-full transition-colors"
            >
              Speak to a consultant
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-gray-200">
            {STATS.map((stat) => (
              <div key={stat.label} className="py-6 sm:py-8 px-4 sm:px-6 border-r border-b border-gray-200">
                <p className="text-3xl sm:text-5xl font-bold text-gray-900 leading-none">
                  {stat.value}
                  <span className="text-red-600">{stat.suffix}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="bg-white">
        {/* Story */}
        <section className="mx-auto max-w-7xl px-6 sm:px-8 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-0.5 bg-red-600" />
                <span className="text-xs font-semibold tracking-widest text-red-600 uppercase">
                  Our story
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                In hospitality, equipment isn&apos;t hardware.{" "}
                <span className="text-red-600">It&apos;s your livelihood.</span>
              </h2>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/kitchen-consultancy/why-us-kitchen.webp"
                  alt="HorecaHost-equipped commercial kitchen"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col justify-end space-y-5 text-gray-600 text-base sm:text-lg leading-relaxed">
              <p>
                For over 25 years, HorecaHost has been the silent partner
                behind successful hotels, bustling restaurants and
                high-volume cafés.
              </p>
              <p>
                We know the right equipment is the difference between a
                smooth service and a chaotic Saturday night — so we treat
                every order as part of someone&apos;s business, not just a
                line on an invoice.
              </p>
              <p className="pt-5 border-t border-gray-200 text-lg sm:text-xl text-gray-900 font-medium leading-snug">
                &ldquo;We aren&apos;t just a catalogue of machinery — we&apos;re a
                legacy of reliability in the HORECA sector.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="bg-gray-50 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Why choose <span className="text-red-600">Horeca Host</span>
              </h2>
              <p className="text-sm text-gray-500 max-w-sm">
                Three things we&apos;ve refined over two decades — and won&apos;t
                compromise on.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.num}
                  className="group flex flex-col gap-5 p-7 bg-white border border-gray-200 rounded-2xl hover:bg-gray-900 hover:border-gray-900 transition-colors duration-300"
                >
                  <p className="text-xs font-bold text-gray-400 group-hover:text-red-500 transition-colors">
                    {pillar.num}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {pillar.description}
                  </p>
                  {pillar.bullets && (
                    <ul className="space-y-2.5 text-sm">
                      {pillar.bullets.map((b, i) => {
                        const [lead, ...rest] = b.split(" — ");
                        return (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <span className="text-gray-600 group-hover:text-gray-300 transition-colors">
                              <strong className="text-gray-900 group-hover:text-white transition-colors">
                                {lead}
                              </strong>
                              {rest.length > 0 ? ` — ${rest.join(" — ")}` : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {pillar.link && (
                    <Link
                      href={pillar.link.href}
                      className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-red-600 group-hover:text-red-500 transition-colors"
                    >
                      {pillar.link.label}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global presence */}
        <section className="bg-gray-900 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-0.5 bg-red-600" />
                  <span className="text-xs font-semibold tracking-widest text-red-500 uppercase">
                    Global presence
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Borders are <span className="text-red-500">not barriers.</span>
                </h2>
              </div>
              <p className="text-sm text-gray-400 max-w-md">
                With international shipping and a dedicated logistics team,
                we keep projects on track — whether it&apos;s a boutique resort
                in the Maldives or a commercial bakery in Dubai.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-gray-700">
              {COUNTRIES.map((loc) => (
                <div
                  key={loc.code}
                  className="flex items-center justify-between gap-3 px-5 py-5 border-r border-b border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center gap-3 text-white font-medium">
                    <span className="text-xl">{loc.flag}</span>
                    {loc.country}
                  </span>
                  <span className="text-xs font-bold text-gray-500">{loc.code}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 sm:px-8 py-14 sm:py-20">
          <div className="bg-red-600 rounded-2xl p-8 sm:p-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-xl">
              Your vision. <span className="text-red-100">Our machinery.</span>
            </h2>
            <div className="space-y-4 max-w-sm">
              <p className="text-sm text-red-50">
                You bring the culinary talent and the guest experience.
                We&apos;ll bring the steel, the steam and the reliability to
                power it all.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/brands"
                  className="bg-white text-red-600 hover:bg-gray-50 font-semibold text-sm px-5 py-3 rounded-full transition-colors"
                >
                  View our brands
                </Link>
                <Link
                  href="/contact"
                  className="border border-white text-white hover:bg-red-700 font-semibold text-sm px-5 py-3 rounded-full transition-colors"
                >
                  Speak to a consultant
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
