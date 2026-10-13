import type { ReactNode } from "react";
import Link from "next/link";
import SaudiArabicFooter from "./SaudiArabicFooter";

export default function SaudiArabicPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div lang="ar" dir="rtl">
    <main className="min-h-screen">
      <section className="bg-gray-900 text-white border-t-4 border-red-600">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12 sm:py-16">
          <nav aria-label="مسار التنقل" className="text-gray-300 mb-6"><Link href="/sa/ar" className="hover:underline">السعودية</Link><span className="mx-3" aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6">{title}</h1>
          <p className="text-gray-300 text-lg leading-loose max-w-3xl">{description}</p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12 sm:py-16">{children}</div>
    </main>
    <SaudiArabicFooter />
  </div>;
}
