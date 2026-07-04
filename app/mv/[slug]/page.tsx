import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountry } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import { ProductWithRelations, Brand, Category } from "@/lib/types";
import CountryCategoryPage from "@/components/country/CountryCategoryPage";
import CountryProductPage from "@/components/country/CountryProductPage";
import CountryBrandPage from "@/components/country/CountryBrandPage";

export const revalidate = 3600;

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

const country = getCountry("mv")!;

const getDBSEO = cache(async (
  table: string,
  columnName: string,
  entityId: number,
) => {
  const { data } = await supabase
    .from(table)
    .select("meta_title, meta_description, h1_tag, paragraph_text")
    .eq(columnName, entityId)
    .eq("country_code", "MV")
    .eq("language", "en")
    .maybeSingle();
  return data;
});

export async function generateStaticParams() {
  const [{ data: categories }, { data: subcategories }, { data: products }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("slug").eq("active", true),
    supabase.from("subcategories").select("slug").eq("active", true),
    supabase.from("products").select("slug").eq("active", true),
    supabase.from("brands").select("slug").eq("active", true),
  ]);
  return [
    ...(categories || []).map((c) => ({ slug: c.slug })),
    ...(subcategories || []).map((s) => ({ slug: s.slug })),
    ...(products || []).map((p) => ({ slug: p.slug })),
    ...(brands || []).map((b) => ({ slug: b.slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("id, name_en, slug")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (product) {
    const dbSEO = await getDBSEO("product_metadata_locations", "product_id", product.id);
    const title = dbSEO?.meta_title || `${product.name_en} Supplier in Maldives | HorecaHost`;
    const description = dbSEO?.meta_description || `Buy ${product.name_en} in the Maldives. HorecaHost supplies premium hospitality equipment to resorts, hotels, and restaurants across the Maldives. Enquire today.`;
    const ogTitle = `${product.name_en} Maldives`;
    const ogDesc = `${product.name_en} — available for delivery to the Maldives`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_ORIGIN}/mv/${slug}`,
        languages: {
          'en-AE': `${SITE_ORIGIN}/${slug}`,
          'en-MU': `${SITE_ORIGIN}/mu/${slug}`,
          'en-MV': `${SITE_ORIGIN}/mv/${slug}`,
          'en-SA': `${SITE_ORIGIN}/sa/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/mv/${slug}`,
        siteName: "HorecaHost",
        type: "website",
        images: [{ url: `/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`, width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image", images: [`/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`] },
    };
  }

  const { data: category } = await supabase
    .from("categories")
    .select("id, name_en, slug")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (category) {
    const dbSEO = await getDBSEO("category_metadata_locations", "category_id", category.id);
    const override = country.seoOverrides?.[slug];
    const title = dbSEO?.meta_title || override?.metaTitle || `${category.name_en} Supplier in Maldives | HorecaHost`;
    const description = dbSEO?.meta_description || override?.metaDescription || `HorecaHost supplies premium ${category.name_en.toLowerCase()} to resorts, hotels, and restaurants across the Maldives. 60+ global brands. Enquire today.`;
    const ogTitle = dbSEO?.h1_tag || override?.h1 || `${category.name_en} Maldives`;
    const ogDesc = dbSEO?.paragraph_text || override?.heroSubtitle || `Premium ${category.name_en} for Maldives Resorts & Hotels`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_ORIGIN}/mv/${slug}`,
        languages: {
          'en-AE': `${SITE_ORIGIN}/${slug}`,
          'en-MU': `${SITE_ORIGIN}/mu/${slug}`,
          'en-MV': `${SITE_ORIGIN}/mv/${slug}`,
          'en-SA': `${SITE_ORIGIN}/sa/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/mv/${slug}`,
        siteName: "HorecaHost",
        type: "website",
        images: [{ url: `/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`, width: 1200, height: 630, alt: `HorecaHost — ${category.name_en} for Maldives` }],
      },
      twitter: { card: "summary_large_image", images: [`/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`] },
    };
  }

  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("id, name_en, slug")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (subcategory) {
    const dbSEO = await getDBSEO("subcategory_metadata_locations", "subcategory_id", subcategory.id);
    const override = country.seoOverrides?.[slug];
    const title = dbSEO?.meta_title || override?.metaTitle || `${subcategory.name_en} Supplier in Maldives | HorecaHost`;
    const description = dbSEO?.meta_description || override?.metaDescription || `HorecaHost supplies premium ${subcategory.name_en.toLowerCase()} to resorts, hotels, and restaurants across the Maldives. 60+ global brands. Enquire today.`;
    const ogTitle = dbSEO?.h1_tag || override?.h1 || `${subcategory.name_en} Maldives`;
    const ogDesc = dbSEO?.paragraph_text || override?.heroSubtitle || `Premium ${subcategory.name_en} for Maldives Resorts & Hotels`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_ORIGIN}/mv/${slug}`,
        languages: {
          'en-AE': `${SITE_ORIGIN}/${slug}`,
          'en-MU': `${SITE_ORIGIN}/mu/${slug}`,
          'en-MV': `${SITE_ORIGIN}/mv/${slug}`,
          'en-SA': `${SITE_ORIGIN}/sa/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/mv/${slug}`,
        siteName: "HorecaHost",
        type: "website",
        images: [{ url: `/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`, width: 1200, height: 630, alt: `HorecaHost — ${subcategory.name_en} for Maldives` }],
      },
      twitter: { card: "summary_large_image", images: [`/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`] },
    };
  }

  const { data: brand } = await supabase
    .from("brands")
    .select("id, name_en, slug")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (brand) {
    const dbSEO = await getDBSEO("brand_metadata_locations", "brand_id", brand.id);
    const title = dbSEO?.meta_title || `${brand.name_en} Equipment Supplier in Maldives | HorecaHost`;
    const description = dbSEO?.meta_description || `HorecaHost supplies ${brand.name_en} equipment to resorts, hotels, and restaurants across the Maldives. Enquire today for pricing and availability.`;
    const ogTitle = `${brand.name_en} Maldives`;
    const ogDesc = `${brand.name_en} equipment — available for delivery to the Maldives`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_ORIGIN}/mv/${slug}`,
        languages: {
          'en-AE': `${SITE_ORIGIN}/${slug}`,
          'en-MU': `${SITE_ORIGIN}/mu/${slug}`,
          'en-MV': `${SITE_ORIGIN}/mv/${slug}`,
          'en-SA': `${SITE_ORIGIN}/sa/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/mv/${slug}`,
        siteName: "HorecaHost",
        type: "website",
        images: [{ url: `/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`, width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image", images: [`/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`] },
    };
  }

  return {};
}

export default async function MaldivesSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // ── Try product ───────────────────────────────────────────────────────────
  const { data: productData } = await supabase
    .from("products")
    .select("*, brand:brands(*), category:categories(*), subcategory:subcategories(*)")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (productData) {
    const cat = (productData as ProductWithRelations).category;
    const breadcrumbSchema = {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Maldives", item: `${SITE_ORIGIN}/mv` },
        ...(cat ? [{ "@type": "ListItem", position: 3, name: cat.name_en, item: `${SITE_ORIGIN}/mv/${cat.slug}` }] : []),
        { "@type": "ListItem", position: cat ? 4 : 3, name: productData.name_en, item: `${SITE_ORIGIN}/mv/${slug}` },
      ],
    };
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: country.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <CountryProductPage country={country} product={productData as ProductWithRelations} />
      </>
    );
  }

  // ── Try category ──────────────────────────────────────────────────────────
  const { data: category } = await supabase
    .from("categories")
    .select("id, name_en, name_ar, slug, active, created_at, updated_at")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (category) {
    const { data: productsData } = await supabase
      .from("products")
      .select("*, brand:brands(*), category:categories(*), subcategory:subcategories(*)")
      .eq("active", true)
      .eq("category_id", category.id)
      .order("created_at", { ascending: false })
      .limit(16);

    const { data: brandsData } = await supabase
      .from("brands")
      .select("*")
      .eq("active", true)
      .order("name_en", { ascending: true });

    const breadcrumbSchema = {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Maldives", item: `${SITE_ORIGIN}/mv` },
        { "@type": "ListItem", position: 3, name: category.name_en, item: `${SITE_ORIGIN}/mv/${slug}` },
      ],
    };
    const collectionSchema = {
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      name: country.seoOverrides?.[slug]?.h1 ?? `${category.name_en} Supplier in Maldives`,
      description: country.seoOverrides?.[slug]?.metaDescription ?? `Premium ${category.name_en.toLowerCase()} for resorts, hotels, and restaurants in the Maldives from HorecaHost.`,
      url: `${SITE_ORIGIN}/mv/${slug}`,
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
        <CountryCategoryPage
          country={country}
          category={category as Category}
          products={(productsData as ProductWithRelations[]) || []}
          brands={(brandsData as Brand[]) || []}
          h1Override={(await getDBSEO("category_metadata_locations", "category_id", category.id))?.h1_tag || country.seoOverrides?.[slug]?.h1}
          subtitleOverride={(await getDBSEO("category_metadata_locations", "category_id", category.id))?.paragraph_text || country.seoOverrides?.[slug]?.heroSubtitle}
        />
      </>
    );
  }

  // ── Try subcategory ───────────────────────────────────────────────────────
  const { data: subcategoryData } = await supabase
    .from("subcategories")
    .select("id, name_en, name_ar, slug, category_id, active, created_at, updated_at")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (subcategoryData) {
    const { data: productsData } = await supabase
      .from("products")
      .select("*, brand:brands(*), category:categories(*), subcategory:subcategories(*)")
      .eq("active", true)
      .eq("subcategory_id", subcategoryData.id)
      .order("created_at", { ascending: false })
      .limit(16);

    const { data: brandsData } = await supabase
      .from("brands")
      .select("*")
      .eq("active", true)
      .order("name_en", { ascending: true });

    const breadcrumbSchema = {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Maldives", item: `${SITE_ORIGIN}/mv` },
        { "@type": "ListItem", position: 3, name: subcategoryData.name_en, item: `${SITE_ORIGIN}/mv/${slug}` },
      ],
    };
    const collectionSchema = {
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      name: country.seoOverrides?.[slug]?.h1 ?? `${subcategoryData.name_en} Supplier in Maldives`,
      description: country.seoOverrides?.[slug]?.metaDescription ?? `Premium ${subcategoryData.name_en.toLowerCase()} for resorts, hotels, and restaurants in the Maldives from HorecaHost.`,
      url: `${SITE_ORIGIN}/mv/${slug}`,
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
        <CountryCategoryPage
          country={country}
          category={subcategoryData as unknown as Category}
          products={(productsData as ProductWithRelations[]) || []}
          brands={(brandsData as Brand[]) || []}
          h1Override={(await getDBSEO("subcategory_metadata_locations", "subcategory_id", subcategoryData.id))?.h1_tag || country.seoOverrides?.[slug]?.h1}
          subtitleOverride={(await getDBSEO("subcategory_metadata_locations", "subcategory_id", subcategoryData.id))?.paragraph_text || country.seoOverrides?.[slug]?.heroSubtitle}
        />
      </>
    );
  }

  // ── Try brand ─────────────────────────────────────────────────────────────
  const { data: brandData } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (brandData) {
    const { data: brandProducts } = await supabase
      .from("products")
      .select("*, brand:brands(*), category:categories(*), subcategory:subcategories(*)")
      .eq("active", true)
      .eq("brand_id", brandData.id)
      .order("created_at", { ascending: false })
      .limit(16);

    const breadcrumbSchema = {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Maldives", item: `${SITE_ORIGIN}/mv` },
        { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_ORIGIN}/brands` },
        { "@type": "ListItem", position: 3, name: brandData.name_en, item: `${SITE_ORIGIN}/mv/${slug}` },
      ],
    };
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: country.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    };
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <CountryBrandPage
          country={country}
          brand={brandData as Brand}
          products={(brandProducts as ProductWithRelations[]) || []}
        />
      </>
    );
  }

  notFound();
}
