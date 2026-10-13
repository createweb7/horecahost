import { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";
import { supabase } from "@/lib/supabase";
import type { Category, ProductWithRelations } from "@/lib/types";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  process.env.SITE_ORIGIN ||
  "https://www.horecahost.com";

export const metadata: Metadata = {
  title: "Products | HorecaHost",
  description:
    "Browse our comprehensive catalog of premium hospitality and commercial kitchen equipment.",
  openGraph: {
    title: "Commercial Kitchen & Hospitality Equipment | HorecaHost",
    description:
      "Browse HorecaHost’s range of commercial kitchen and hospitality equipment for hotels, restaurants, cafés, and catering businesses.",
    url: `${SITE_ORIGIN}/products`,
    siteName: "HorecaHost",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Kitchen & Hospitality Equipment | HorecaHost",
    description:
      "Browse HorecaHost’s range of commercial kitchen and hospitality equipment.",
  },
  alternates: {
    canonical: `${SITE_ORIGIN}/products`,
    languages: {
      "ar-SA": `${SITE_ORIGIN}/sa/ar/products`,
      'en-AE': `${SITE_ORIGIN}/products`,
      'en-SA': `${SITE_ORIGIN}/sa/products`,
      'en-MU': `${SITE_ORIGIN}/mu/products`,
      'en-MV': `${SITE_ORIGIN}/mv/products`,
      'x-default': `${SITE_ORIGIN}/products`,
    },
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search = "" } = await searchParams;
  const limit = 12;
  let query = supabase
    .from("products")
    .select("*, brand:brands(*), category:categories(*), subcategory:subcategories(*)", { count: "exact" })
    .eq("active", true)
    .order("created_at", { ascending: false })
    .range(0, limit - 1);

  if (search.trim()) {
    const safeSearch = search.trim().replace(/[%,()]/g, " ");
    query = query.or(`name_en.ilike.%${safeSearch}%,name_ar.ilike.%${safeSearch}%,model.ilike.%${safeSearch}%`);
  }

  const [{ data: productData, count }, { data: categoryData }] = await Promise.all([
    query,
    supabase.from("categories").select("*").eq("active", true).order("name_en"),
  ]);

  // Generate BreadcrumbList schema for products page
  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_ORIGIN,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${SITE_ORIGIN}/products`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <ProductsPageClient
        initialProducts={(productData as ProductWithRelations[]) || []}
        initialCategories={(categoryData as Category[]) || []}
        initialTotal={count || 0}
        initialSearch={search}
      />
    </>
  );
}
