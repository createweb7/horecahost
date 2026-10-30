import type { Metadata } from "next";
import BrandsPageClient from "./BrandsPageClient";
import { supabase } from "@/lib/supabase";
import type { Brand } from "@/lib/types";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  process.env.SITE_ORIGIN ||
  "https://www.horecahost.com";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brands - Browse Premium Hospitality Equipment Brands | HorecaHost",
  description:
    "Explore our curated selection of premium brands supplying hospitality and commercial kitchen equipment. Find trusted equipment manufacturers for your business.",
  openGraph: {
    title: "Brands - Browse Premium Hospitality Equipment Brands | HorecaHost",
    description:
      "Explore our curated selection of premium brands supplying hospitality and commercial kitchen equipment.",
    type: "website",
    url: "/brands",
  },
  alternates: {
    canonical: `${SITE_ORIGIN}/brands`,
    languages: {
      "ar-SA": `${SITE_ORIGIN}/sa/ar/brands`,
      'en-AE': `${SITE_ORIGIN}/brands`,
      'en-SA': `${SITE_ORIGIN}/sa/brands`,
      'en-MU': `${SITE_ORIGIN}/mu/brands`,
      'en-MV': `${SITE_ORIGIN}/mv/brands`,
      'x-default': `${SITE_ORIGIN}/brands`,
    },
  },
};

export interface BrandWithMeta extends Brand {
  productCount: number;
  primaryCategory: string | null;
}

export default async function BrandsPage() {
  const [{ data: brandData }, { data: categoryData }, { data: productData }] = await Promise.all([
    supabase.from("brands").select("*").eq("active", true).order("name_en"),
    supabase.from("categories").select("id, name_en").eq("active", true),
    supabase.from("products").select("brand_id, category_id").eq("active", true),
  ]);

  const categoryNameById = new Map<number, string>(
    (categoryData || []).map((c) => [c.id, c.name_en])
  );

  // Tally product count + category frequency per brand from the slim product rows
  const countByBrand = new Map<number, number>();
  const categoryTallyByBrand = new Map<number, Map<number, number>>();

  for (const p of productData || []) {
    if (!p.brand_id) continue;
    countByBrand.set(p.brand_id, (countByBrand.get(p.brand_id) || 0) + 1);

    if (p.category_id) {
      if (!categoryTallyByBrand.has(p.brand_id)) categoryTallyByBrand.set(p.brand_id, new Map());
      const tally = categoryTallyByBrand.get(p.brand_id)!;
      tally.set(p.category_id, (tally.get(p.category_id) || 0) + 1);
    }
  }

  const brands: BrandWithMeta[] = (brandData || []).map((brand) => {
    const tally = categoryTallyByBrand.get(brand.id);
    let primaryCategory: string | null = null;
    if (tally && tally.size > 0) {
      const topCategoryId = [...tally.entries()].sort((a, b) => b[1] - a[1])[0][0];
      primaryCategory = categoryNameById.get(topCategoryId) || null;
    }
    return {
      ...brand,
      productCount: countByBrand.get(brand.id) || 0,
      primaryCategory,
    };
  });

  // BreadcrumbList schema for brands listing page
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
        name: "Brands",
        item: `${SITE_ORIGIN}/brands`,
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
      <BrandsPageClient initialBrands={brands} />
    </>
  );
}
