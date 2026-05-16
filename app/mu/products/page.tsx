import { Metadata } from "next";
import Link from "next/link";
import { getCountry } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import { ProductWithRelations, Category } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";
import Footer from "@/components/global/Footer";
import { Package, ArrowRight } from "lucide-react";

export const revalidate = 3600;

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

const country = getCountry("mu")!;

export const metadata: Metadata = {
  title: "Commercial Equipment Available in Mauritius | HorecaHost",
  description:
    "Browse 500+ commercial kitchen and hospitality equipment products available for delivery to Mauritius. Hotels, beach resorts, and restaurants — all served by HorecaHost.",
  alternates: {
    canonical: `${SITE_ORIGIN}/mu/products`,
    languages: {
      'en-AE': `${SITE_ORIGIN}/products`,
      'en-MU': `${SITE_ORIGIN}/mu/products`,
      'en-MV': `${SITE_ORIGIN}/mv/products`,
    },
  },
  openGraph: {
    title: "Commercial Equipment Available in Mauritius | HorecaHost",
    description: "500+ products from 60+ global brands — delivered to Mauritius.",
    url: `${SITE_ORIGIN}/mu/products`,
    siteName: "HorecaHost",
    type: "website",
    images: [{ url: `/api/og?title=Equipment+for+Mauritius&description=500%2B+Products+from+60%2B+Global+Brands`, width: 1200, height: 630 }],
  },
};

export default async function MauritiusProductsPage() {
  const [{ data: productsData }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, brand:brands(*), category:categories(*), subcategory:subcategories(*)")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(48),
    supabase.from("categories").select("id, name_en, slug").eq("active", true).order("name_en"),
  ]);

  const products = (productsData as ProductWithRelations[]) || [];

  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Mauritius", item: `${SITE_ORIGIN}/mu` },
      { "@type": "ListItem", position: 3, name: "Products", item: `${SITE_ORIGIN}/mu/products` },
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
            <nav className="text-sm text-gray-500 mb-8">
              <Link href="/mu" className="hover:text-white transition-colors">{country.flag} Mauritius</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-300">Products</span>
            </nav>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Commercial Equipment Available in Mauritius
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Browse our full range of hospitality equipment — all available for delivery to hotels, beach resorts, and restaurants across Mauritius.
            </p>
          </div>
        </section>

        {/* Category filters */}
        {categories && categories.length > 0 && (
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 py-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-semibold text-gray-500 mr-2">Browse by category:</span>
                {(categories as Category[]).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/mu/${cat.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 border border-gray-300 bg-white hover:border-red-400 hover:text-red-600 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {cat.name_en}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products grid */}
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 py-12">
          <p className="text-sm text-gray-500 mb-8">
            Showing {products.length} products — <Link href="/contact" className="text-red-600 hover:underline">contact us</Link> for full availability in Mauritius
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} locale="en" href={`/mu/${product.slug}`} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-4" />
              <p>Products loading…</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
