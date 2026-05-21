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
              About HorecaHost
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              The Engine Behind World-Class Hospitality
            </p>
            <div className="text-gray-700">
              <p className="font-semibold">25 Years of Experience. 60+ Global Brands. One Standard of Excellence.</p>
            </div>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-16">
          {/* The Hook: Who We Are */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">We Don't Just Supply Kitchens. We Build Businesses.</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                For over 25 years, HorecaHost has been the silent partner behind successful hotels, bustling restaurants, and high-volume cafés. We understand that in the hospitality industry, equipment isn't just hardware—it's your livelihood. It's the difference between a smooth service and a chaotic Saturday night.
              </p>
              <p>
                We aren't just a catalog of machinery; we are a legacy of reliability in the HORECA sector.
              </p>
            </div>
          </section>

          {/* The "Why Us" Block: Our Core Advantages */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Why Choose HorecaHost</h2>
            <div className="space-y-8">
              
              {/* Advantage 1 */}
              <div className="border-l-4 border-red-600 pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Factory-to-Customer Advantage</h3>
                <p className="text-gray-600 text-lg mb-4">
                  Why pay for markups when you can pay for quality? We operate on a direct factory-to-customer model. By cutting out unnecessary middlemen, we deliver premium commercial equipment directly to your doorstep—complete with manufacturer warranties.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">✓</span>
                    <span><strong>Better Value:</strong> Your budget goes into the machine, not the supply chain.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 font-bold mr-3">✓</span>
                    <span><strong>Direct Accountability:</strong> You get authentic products with clear support channels.</span>
                  </li>
                </ul>
              </div>

              {/* Advantage 2 */}
              <div className="border-l-4 border-red-600 pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">A Curator of Global Excellence</h3>
                <p className="text-gray-600 text-lg">
                  Quantity means nothing without quality. We have spent two decades vetting the market to curate a portfolio of over 60 unmatched global brands. Whether you need precision Italian espresso machines or heavy-duty German refrigeration, we source the gold standard of what the world has to offer.
                </p>
              </div>

              {/* Advantage 3 — Consulting */}
              <div className="border-l-4 border-red-600 pl-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Consulting, Not Just Sales</h3>

                {/* Intro block */}
                <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-100">
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    At HORECA HOST Consulting, we take pride in delivering maximum value and return on investment for every dollar spent. With experience working across a wide range of projects — including clients with strict budget requirements — we understand the importance of maintaining cost-effective solutions without compromising on quality, performance, or project deliverables.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    We provide comprehensive consulting services tailored to the hospitality and foodservice industry. Our expertise includes developing effective systems and processes to help businesses attract, engage, and develop a strong workforce.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Our dedicated research team uses proven methodologies to collect, analyze, and interpret data, delivering insightful reports that support operational growth and business success.
                  </p>
                </div>

                {/* Kitchen Consulting Services */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Kitchen Consulting Services</h4>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    Our Kitchen Consultants bridge the gap between culinary vision and practical execution by designing highly functional, safe, and efficient kitchen spaces. Depending on the project requirements, our services cover both residential kitchen design and commercial foodservice facility planning for restaurants, hotels, cafés, and catering operations.
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    If you are planning to open or renovate a restaurant, contact us for a professional consultation. Our experts provide you with innovative concepts, technical drawings, and highly professional solutions tailored to your business needs.
                  </p>
                </div>

                {/* Why Choose — grid */}
                <div className="bg-gray-900 rounded-2xl p-8">
                  <h4 className="text-xl font-bold text-white mb-6">Why Choose Horeca Host</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      "Unique and innovative design approach",
                      "Strong technical expertise and industry knowledge",
                      "Professional kitchen planning and layout solutions",
                      "Guidance in selecting the right kitchen equipment for maximum productivity",
                      "Cost-saving solutions without compromising quality",
                      "End-to-end support for hospitality and restaurant projects",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-red-500 font-bold text-lg shrink-0 mt-0.5">✓</span>
                        <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed border-t border-gray-700 pt-6">
                    Our expertise team ensures that every kitchen is designed with efficiency, productivity, safety, and long-term operational success while helping clients optimize investment and reduce unnecessary costs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* The Reach: Global Capability */}
          <section className="mb-20 bg-gray-50 rounded-lg p-12 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Borders Are Not Barriers</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Great hospitality is universal, and so is HorecaHost. With robust international shipping capabilities, we support clients across the globe. Whether you are opening a boutique resort in the Maldives or a commercial bakery in Dubai, our logistics team ensures your project stays on track.
            </p>
          </section>

          {/* Global Presence */}
          <section className="mb-20">
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
            <h2 className="text-3xl font-bold mb-4">Your Vision. Our Machinery.</h2>
            <p className="text-lg mb-8 text-red-50">
              You bring the culinary talent and the guest experience. We'll bring the steel, the steam, and the reliability to power it all.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/brands"
                className="inline-block bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Our Brands
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-red-700 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-800 transition-colors border border-white"
              >
                Speak to a Consultant
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
