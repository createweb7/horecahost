"use client";

import Link from "next/link";
import Footer from "@/components/global/Footer";

export default function AboutPageClient() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            {" › "}
            <span className="text-gray-900 font-semibold">About Us</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About Horeca Host
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-600">
              Your trusted partner in premium hospitality equipment solutions
            </p>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-16">
          {/* Our Story */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                Horeca Host was founded with a mission to bridge the gap between
                hospitality businesses and premium equipment suppliers
                worldwide. What started as a small initiative has grown into a
                global enterprise serving thousands of restaurants, hotels,
                catering facilities, and food service operations.
              </p>
              <p>
                We understand the unique challenges faced by hospitality
                professionals. That&apos;s why we&apos;ve dedicated ourselves to
                sourcing, supplying, and supporting the best equipment brands in
                the industry, ensuring our clients get exactly what they need
                for their operations.
              </p>
              <p>
                With presence in over 10 countries including UAE, USA, Malaysia,
                Italy, and beyond, we leverage our global network to provide
                competitive pricing, reliable delivery, and exceptional customer
                support.
              </p>
            </div>
          </section>

          {/* Our Mission */}
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-4xl font-bold text-red-600 mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Our Mission
                </h3>
                <p className="text-gray-600">
                  To provide hospitality businesses worldwide with
                  premium-quality equipment and exceptional service that helps
                  them succeed and grow.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-4xl font-bold text-red-600 mb-4">👁️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Our Vision
                </h3>
                <p className="text-gray-600">
                  To be the most trusted and reliable source for hospitality
                  equipment solutions globally, known for quality, integrity,
                  and customer&apos;s satisfaction.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-4xl font-bold text-red-600 mb-4">⭐</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Our Values
                </h3>
                <p className="text-gray-600">
                  Quality, reliability, integrity, and customer&apos;s approach
                  guide everything we do. We&apos;re committed to building
                  long&apos;term relationships.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Why Choose Horeca Host
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Global Network",
                  description:
                    "With offices and partners across continents, we ensure worldwide coverage and local expertise.",
                },
                {
                  title: "Premium Brands",
                  description:
                    "We partner with industry-leading brands like Vulcan, Rational, Continental Forni, and many more.",
                },
                {
                  title: "Expert Team",
                  description:
                    "Our team has decades of combined experience in hospitality equipment and industry best practices.",
                },
                {
                  title: "Competitive Pricing",
                  description:
                    "Our global sourcing capabilities allow us to offer competitive prices without compromising quality.",
                },
                {
                  title: "Reliable Support",
                  description:
                    "From consultation to after-sales service, we provide comprehensive support at every stage.",
                },
                {
                  title: "Quality Assurance",
                  description:
                    "Every product goes through rigorous quality checks to ensure it meets international standards.",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Our Products & Services */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What We Offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                "Cooking Equipment",
                "Refrigeration Systems",
                "Food Preparation",
                "Beverage Equipment",
                "Baking & Ovens",
                "Dish Washing Systems",
                "Food Warming & Display",
                "Ventilation Systems",
                "Small Wares & Accessories",
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200"
                >
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {item}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    Premium selection from leading brands
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Global Presence */}
          <section className="bg-gray-50 rounded-lg p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Our Global Presence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { country: "United Arab Emirates", flag: "🇦🇪" },
                { country: "United States", flag: "🇺🇸" },
                { country: "Malaysia", flag: "🇲🇾" },
                { country: "Italy", flag: "🇮🇹" },
                { country: "Mauritius", flag: "🇲🇺" },
                { country: "Bahrain", flag: "🇧🇭" },
                { country: "Qatar", flag: "🇶🇦" },
                { country: "India", flag: "🇮🇳" },
              ].map((loc, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-3">{loc.flag}</div>
                  <p className="font-semibold text-gray-900">{loc.country}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-20 bg-red-600 rounded-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
            <p className="text-lg mb-8 text-red-50">
              Contact our team today to discuss your hospitality equipment
              needs.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get In Touch
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
