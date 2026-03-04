"use client";

import Link from "next/link";
import Script from "next/script";
import Footer from "@/components/global/Footer";
import ContactForm from "@/components/contact/ContactForm";

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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378l-.361.214-3.741-.982.998 3.645-.235.374a9.86 9.86 0 001.51 5.748c.375.563.89 1.096 1.516 1.554h.005c1.5 1.086 3.408 1.71 5.337 1.71 1.066 0 2.107-.174 3.101-.52l.372-.12 3.861 1.012-.997-3.648.235-.374c.637-.997 1.111-2.08 1.38-3.207.08-.311.15-.624.196-.938.04-.314.061-.629.061-.945v-.015C21.960 6.092 18.017 2.166 13.051 2.166m5.868 18.66a11.868 11.868 0 01-6.923 2.228c-1.395 0-2.748-.244-4.034-.718l-.405-.135-4.201 1.102 1.12-4.097-.271-.432a11.901 11.901 0 01-1.746-6.505c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12z" />
                  </svg>
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
