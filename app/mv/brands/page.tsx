import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCountry } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import { Brand } from "@/lib/types";
import Footer from "@/components/global/Footer";

export const revalidate = 3600;

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

const country = getCountry("mv")!;

export const metadata: Metadata = {
  title: "Equipment Brands Available in Maldives | HorecaHost",
  description:
    "Browse 60+ world-class hospitality and commercial kitchen equipment brands available for delivery to the Maldives. HorecaHost — your trusted supplier.",
  alternates: { canonical: `${SITE_ORIGIN}/mv/brands` },
  openGraph: {
    title: "Equipment Brands Available in Maldives | HorecaHost",
    description: "60+ global brands — all available for delivery to the Maldives.",
    url: `${SITE_ORIGIN}/mv/brands`,
    siteName: "HorecaHost",
    type: "website",
    images: [{ url: `/api/og?title=Brands+for+Maldives&description=60%2B+World-Class+Equipment+Brands`, width: 1200, height: 630 }],
  },
};

export default async function MaldivesBrandsPage() {
  const { data: brandsData } = await supabase
    .from("brands")
    .select("*")
    .eq("active", true)
    .order("name_en", { ascending: true });

  const brands = (brandsData as Brand[]) || [];

  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Maldives", item: `${SITE_ORIGIN}/mv` },
      { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_ORIGIN}/mv/brands` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative bg-gray-900 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
          <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 pt-6 pb-16">
            <nav className="text-sm text-gray-500 mb-8 flex flex-wrap gap-1 items-center">
              <Link href="/mv" className="hover:text-white transition-colors">{country.flag} Maldives</Link>
              <span>›</span>
              <span className="text-gray-300">Brands</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <span>{country.flag}</span>
              Maldives
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Equipment Brands Available in Maldives
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              {brands.length}+ world-class hospitality and commercial kitchen equipment brands — all available for delivery to resorts, hotels, and restaurants across the Maldives.
            </p>
          </div>
        </section>

        {/* Brands grid */}
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/mv/${brand.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 p-4 flex flex-col items-center justify-center gap-3 hover:border-red-300 hover:shadow-lg transition-all aspect-square"
                title={brand.name_en}
              >
                {brand.image_path ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={brand.image_path}
                      alt={brand.name_en}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
                    />
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-red-600 transition-colors line-clamp-2">
                    {brand.name_en}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
