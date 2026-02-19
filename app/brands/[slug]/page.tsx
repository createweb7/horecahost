import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import BrandDetailClient from "./BrandDetailClient";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // In Next.js 16, params is a Promise in generateMetadata
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams as any;

  // Fetch brand by slug
  const { data: brand } = await supabase
    .from("brands")
    .select("id, name_en, name_ar, slug")
    .eq("slug", slug)
    .maybeSingle();

  if (!brand) {
    return {
      title: "Brand Not Found",
      description: "The brand you are looking for does not exist.",
    };
  }

  // Fetch metadata for this brand (default to AE and en)
  const { data: metadata } = await supabase
    .from("brand_metadata_locations")
    .select("*")
    .eq("brand_id", brand.id)
    .eq("country_code", "AE")
    .eq("language", "en")
    .maybeSingle();

  // Sanitize: remove any HTML tags from metadata (including encoded HTML entities)
  const sanitize = (text: string | null | undefined): string => {
    if (!text) return "";
    let decoded = String(text)
      // Decode HTML entities first
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    // Then remove HTML tags
    return decoded.replace(/<[^>]*>/g, "").trim();
  };

  const title = sanitize(metadata?.meta_title) || brand.name_en;
  const description =
    sanitize(metadata?.meta_description) ||
    `${brand.name_en} - Premium Commercial Equipment`;
  const keywords =
    sanitize(metadata?.meta_keywords) ||
    `${brand.name_en}, commercial equipment`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/brands/${slug}`,
    },
    alternates: {
      canonical: `/brands/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const { data: brands } = await supabase
    .from("brands")
    .select("slug")
    .limit(100);

  return (brands || []).map((brand) => ({
    slug: brand.slug,
  }));
}

export default async function BrandDetailPage({ params }: Props) {
  // In Next.js 16, params is a Promise
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams as any;

  // Fetch brand data server-side to pass to client
  const { data: brand } = await supabase
    .from("brands")
    .select("id, name_en, name_ar, slug")
    .eq("slug", slug)
    .single();

  // Fetch metadata server-side to pass to client
  let metadata = null;
  if (brand) {
    // First try: fetch for AE, en
    const { data: metaData, error: error1 } = await supabase
      .from("brand_metadata_locations")
      .select("*")
      .eq("brand_id", brand.id)
      .eq("country_code", "AE")
      .eq("language", "en")
      .single();

    metadata = metaData;

    // If not found, try to fetch ANY metadata for this brand
    if (!metadata) {
      const { data: anyMetadata } = await supabase
        .from("brand_metadata_locations")
        .select("*")
        .eq("brand_id", brand.id)
        .limit(1)
        .single();

      metadata = anyMetadata;

      console.log(`⚠️ [Server] No metadata found for AE/en, using fallback:`, {
        brand_id: brand.id,
        fallback_found: !!metadata,
      });
    }

    // Debug logging
    console.log(
      `📊 [Server] Brand metadata for ${brand.name_en} (ID: ${brand.id}):`,
      {
        metadata_found: !!metadata,
        h1_tag: metadata?.h1_tag || "NOT SET",
        h2_tag: metadata?.h2_tag || "NOT SET",
        paragraph_text: metadata?.paragraph_text || "NOT SET",
        meta_title: metadata?.meta_title || "NOT SET",
        meta_description: metadata?.meta_description || "NOT SET",
        meta_keywords: metadata?.meta_keywords || "NOT SET",
        country_code: metadata?.country_code || "N/A",
        language: metadata?.language || "N/A",
      },
    );

    // Log full metadata object to see all fields
    console.log("Full metadata object:", JSON.stringify(metadata, null, 2));
  }

  // BreadcrumbList schema for navigation
  const SITE_ORIGIN =
    process.env.NEXT_PUBLIC_SITE_ORIGIN ||
    process.env.SITE_ORIGIN ||
    "https://www.horecahost.com";

  const breadcrumbSchema = brand
    ? {
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
          {
            "@type": "ListItem",
            position: 3,
            name: brand.name_en,
            item: `${SITE_ORIGIN}/brands/${slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {/* BreadcrumbList Schema for Brands */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <BrandDetailClient slug={slug} brand={brand} metadata={metadata} />
    </>
  );
}
