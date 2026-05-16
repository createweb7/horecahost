import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCountry } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import { ProductWithRelations, Brand, Category, Subcategory } from "@/lib/types";
import CountryCategoryPage from "@/components/country/CountryCategoryPage";
import CountryProductPage from "@/components/country/CountryProductPage";
import CountryBrandPage from "@/components/country/CountryBrandPage";

export const revalidate = 3600;

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

const country = getCountry("mu")!;

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
    const title = `${product.name_en} Supplier in Mauritius | HorecaHost`;
    const description = `Buy ${product.name_en} in Mauritius. HorecaHost supplies premium hospitality equipment to hotels, beach resorts, and restaurants across Mauritius. Enquire today.`;
    const ogTitle = `${product.name_en} Mauritius`;
    const ogDesc = `${product.name_en} — available for delivery to Mauritius`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_ORIGIN}/mu/${slug}`,
        languages: {
          'en-AE': `${SITE_ORIGIN}/${slug}`,
          'en-MU': `${SITE_ORIGIN}/mu/${slug}`,
          'en-MV': `${SITE_ORIGIN}/mv/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/mu/${slug}`,
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
    const override = country.seoOverrides?.[slug];
    const title = override?.metaTitle ?? `${category.name_en} Supplier in Mauritius | HorecaHost`;
    const description = override?.metaDescription ?? `HorecaHost supplies premium ${category.name_en.toLowerCase()} to hotels, beach resorts, and restaurants across Mauritius. 60+ global brands. Enquire today.`;
    const ogTitle = override?.h1 ?? `${category.name_en} Mauritius`;
    const ogDesc = override?.heroSubtitle ?? `Premium ${category.name_en} for Mauritius Hotels & Resorts`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_ORIGIN}/mu/${slug}`,
        languages: {
          'en-AE': `${SITE_ORIGIN}/${slug}`,
          'en-MU': `${SITE_ORIGIN}/mu/${slug}`,
          'en-MV': `${SITE_ORIGIN}/mv/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/mu/${slug}`,
        siteName: "HorecaHost",
        type: "website",
        images: [{ url: `/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`, width: 1200, height: 630, alt: `HorecaHost — ${category.name_en} for Mauritius` }],
      },
      twitter: { card: "summary_large_image", images: [`/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`] },
    };
  }

  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("id, name_en, name_ar, slug, category_id, active, created_at, updated_at")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (subcategory) {
    const override = country.seoOverrides?.[slug];
    const title = override?.metaTitle ?? `${subcategory.name_en} Supplier in Mauritius | HorecaHost`;
    const description = override?.metaDescription ?? `HorecaHost supplies premium ${subcategory.name_en.toLowerCase()} to hotels, beach resorts, and restaurants across Mauritius. 60+ global brands. Enquire today.`;
    const ogTitle = override?.h1 ?? `${subcategory.name_en} Mauritius`;
    const ogDesc = override?.heroSubtitle ?? `Premium ${subcategory.name_en} for Mauritius Hotels & Resorts`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_ORIGIN}/mu/${slug}`,
        languages: {
          'en-AE': `${SITE_ORIGIN}/${slug}`,
          'en-MU': `${SITE_ORIGIN}/mu/${slug}`,
          'en-MV': `${SITE_ORIGIN}/mv/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/mu/${slug}`,
        siteName: "HorecaHost",
        type: "website",
        images: [{ url: `/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`, width: 1200, height: 630, alt: `HorecaHost — ${subcategory.name_en} for Mauritius` }],
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
    const title = `${brand.name_en} Equipment Supplier in Mauritius | HorecaHost`;
    const description = `HorecaHost supplies ${brand.name_en} equipment to hotels, beach resorts, and restaurants across Mauritius. Enquire today for pricing and availability.`;
    const ogTitle = `${brand.name_en} Mauritius`;
    const ogDesc = `${brand.name_en} equipment — available for delivery to Mauritius`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_ORIGIN}/mu/${slug}`,
        languages: {
          'en-AE': `${SITE_ORIGIN}/${slug}`,
          'en-MU': `${SITE_ORIGIN}/mu/${slug}`,
          'en-MV': `${SITE_ORIGIN}/mv/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_ORIGIN}/mu/${slug}`,
        siteName: "HorecaHost",
        type: "website",
        images: [{ url: `/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`, width: 1200, height: 630 }],
      },
      twitter: { card: "summary_large_image", images: [`/api/og?title=${encodeURIComponent(ogTitle)}&description=${encodeURIComponent(ogDesc)}`] },
    };
  }

  return {};
}

export default async function MauritiusSlugPage({
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
        { "@type": "ListItem", position: 2, name: "Mauritius", item: `${SITE_ORIGIN}/mu` },
        ...(cat ? [{ "@type": "ListItem", position: 3, name: cat.name_en, item: `${SITE_ORIGIN}/mu/${cat.slug}` }] : []),
        { "@type": "ListItem", position: cat ? 4 : 3, name: productData.name_en, item: `${SITE_ORIGIN}/mu/${slug}` },
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
        { "@type": "ListItem", position: 2, name: "Mauritius", item: `${SITE_ORIGIN}/mu` },
        { "@type": "ListItem", position: 3, name: category.name_en, item: `${SITE_ORIGIN}/mu/${slug}` },
      ],
    };
    const collectionSchema = {
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      name: `${category.name_en} Supplier in Mauritius`,
      description: `Premium ${category.name_en.toLowerCase()} for hotels, beach resorts, and restaurants in Mauritius from HorecaHost.`,
      url: `${SITE_ORIGIN}/mu/${slug}`,
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
          h1Override={country.seoOverrides?.[slug]?.h1}
          subtitleOverride={country.seoOverrides?.[slug]?.heroSubtitle}
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
        { "@type": "ListItem", position: 2, name: "Mauritius", item: `${SITE_ORIGIN}/mu` },
        { "@type": "ListItem", position: 3, name: subcategoryData.name_en, item: `${SITE_ORIGIN}/mu/${slug}` },
      ],
    };
    const collectionSchema = {
      "@context": "https://schema.org/",
      "@type": "CollectionPage",
      name: country.seoOverrides?.[slug]?.h1 ?? `${subcategoryData.name_en} Supplier in Mauritius`,
      description: country.seoOverrides?.[slug]?.metaDescription ?? `Premium ${subcategoryData.name_en.toLowerCase()} for hotels, beach resorts, and restaurants in Mauritius from HorecaHost.`,
      url: `${SITE_ORIGIN}/mu/${slug}`,
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
          h1Override={country.seoOverrides?.[slug]?.h1}
          subtitleOverride={country.seoOverrides?.[slug]?.heroSubtitle}
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
        { "@type": "ListItem", position: 1, name: "Mauritius", item: `${SITE_ORIGIN}/mu` },
        { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_ORIGIN}/brands` },
        { "@type": "ListItem", position: 3, name: brandData.name_en, item: `${SITE_ORIGIN}/mu/${slug}` },
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
