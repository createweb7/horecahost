"use client";

import Link from "next/link";
import Script from "next/script";
import Footer from "@/components/global/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactPageClient() {
  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />
      {/* Breadcrumb */}
      <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            {" › "}
            <span className="text-gray-900 font-semibold">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-600">
              We&apos;d love to hear from you. Reach out to our team anytime.
            </p>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-white">
        {/* Contact Information Cards */}
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Contact 1 - UAE */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇦🇪</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Abdul Kabeer</h4>
              <p className="text-xs text-gray-600 mb-3">United Arab Emirates</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+971503079863"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +971 50 307 9863
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+971503079863"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +971 50 307 9863
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:gm@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    gm@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 2 - UAE */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇦🇪</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Irshad Ahmed</h4>
              <p className="text-xs text-gray-600 mb-3">United Arab Emirates</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+971507758742"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +971 50 7758742
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+971507758742"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +971 50 7758742
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:irshad@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    irshad@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 3 - UAE */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇦🇪</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Mohammed</h4>
              <p className="text-xs text-gray-600 mb-3">United Arab Emirates</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+971504624324"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +971 50 462 4324
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+971504624324"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +971 50 462 4324
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:mohammed@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    mohammed@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 4 - USA */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇺🇸</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Shaik</h4>
              <p className="text-xs text-gray-600 mb-3">United States</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+15122943836"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +1 512 294 3836
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+15122943836"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +1 512 294 3836
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:shaik@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    shaik@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 5 - Malaysia */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇲🇾</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Meera</h4>
              <p className="text-xs text-gray-600 mb-3">Malaysia</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+60178702132"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +60 178 702 132
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+60178702132"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +60 178 702 132
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hhm@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hhm@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 6 - Italy */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇮🇹</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Fedreico</h4>
              <p className="text-xs text-gray-600 mb-3">Italy</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+393429935695"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +39 342 993 5695
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+393429935695"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +39 342 993 5695
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hhit@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hhit@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 7 - Mauritius */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇲🇺</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Sahabooleea</h4>
              <p className="text-xs text-gray-600 mb-3">Mauritius</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+23057348666"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +230 57 348 666
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+23057348666"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +230 57 348 666
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:sn@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    sn@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 8 - Bahrain */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇧🇭</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Gani</h4>
              <p className="text-xs text-gray-600 mb-3">Bahrain</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+97333322762"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +973 3332 2762
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+97333322762"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +973 3332 2762
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:gani@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    gani@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 9 - Bahrain */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇧🇭</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Hansul</h4>
              <p className="text-xs text-gray-600 mb-3">Bahrain</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+97333381762"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +973 3338 1762
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+97333381762"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +973 3338 1762
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hansul@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hansul@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 10 - Qatar */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇶🇦</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Hakkim</h4>
              <p className="text-xs text-gray-600 mb-3">Qatar</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+97430839587"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +974 3083 9587
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+97430839587"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +974 3083 9587
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hhqt@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hhqt@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 11 - India */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇮🇳</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Mahadeer</h4>
              <p className="text-xs text-gray-600 mb-3">India</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+919629505892"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +91 9629 505 892
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+919629505892"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +91 9629 505 892
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:hhin@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    hhin@horecahost.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact 12 - Kenya */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="text-2xl mb-3">🇰🇪</div>
              <h4 className="font-bold text-gray-900 mb-1">Mr. Arvind</h4>
              <p className="text-xs text-gray-600 mb-3">Kenya</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">📞</span>
                  <a
                    href="tel:+254717445591"
                    className="text-gray-700 hover:text-red-600"
                  >
                    +254 717 445 591
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <FaWhatsapp className="w-5 h-5 text-green-600" />
                  <a
                    href="https://api.whatsapp.com/send?phone=+254717445591"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600"
                  >
                    +254 717 445 591
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✉️</span>
                  <a
                    href="mailto:arvind@horecahost.com"
                    className="text-gray-700 hover:text-red-600 truncate"
                  >
                    arvind@horecahost.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Company Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About Horeca Host
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Horeca Host is your trusted partner in the hospitality
                  equipment industry, serving businesses across multiple
                  continents with premium-quality products and exceptional
                  service.
                </p>
                <p>
                  With offices in UAE, USA, Malaysia, Italy, and beyond, we
                  provide sourcing solutions for restaurants, hotels, catering
                  facilities, and food service operations.
                </p>
                <p>
                  Our expertise spans leading brands including Vulcan,
                  Continental Forni, Rational, and many others, ensuring you get
                  the best equipment for your business needs.
                </p>
                <div className="pt-6 border-t border-gray-300 mt-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Business Hours
                  </h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM (GST)</p>
                  <p>Saturday: 10:00 AM - 4:00 PM (GST)</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full bg-gray-50 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Global Presence
            </h2>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/d/u/2/embed?mid=153sG3FGU9fwjbPnkMuhbHfOqMs3eAzA&ehbc=2E312F&noprof=1"
                width="100%"
                height="500"
                style={{ border: 0 }}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
