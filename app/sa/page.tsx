import { Metadata } from "next";
import { getCountry } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import { ProductWithRelations, Brand } from "@/lib/types";
import CountryPage from "@/components/country/CountryPage";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

const country = getCountry("sa")!;

export const metadata: Metadata = {
  title: country.metaTitle,
  description: country.metaDescription,
  alternates: {
    canonical: `${SITE_ORIGIN}/sa`,
    languages: {
      'en-AE': `${SITE_ORIGIN}`,
      'en-SA': `${SITE_ORIGIN}/sa`,
      'en-MU': `${SITE_ORIGIN}/mu`,
      'en-MV': `${SITE_ORIGIN}/mv`,
    },
  },
  openGraph: {
    title: country.metaTitle,
    description: country.metaDescription,
    url: `${SITE_ORIGIN}/sa`,
    siteName: "HorecaHost",
    type: "website",
    images: [
      {
        url: `/api/og?title=Kitchen+Equipment+Supplier+in+Saudi+Arabia&description=Commercial+Kitchen+%26+Hospitality+Equipment+for+Saudi+Hotels+%26+Restaurants`,
        width: 1200,
        height: 630,
        alt: "HorecaHost — Kitchen Equipment Supplier in Saudi Arabia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      `/api/og?title=Kitchen+Equipment+Supplier+in+Saudi+Arabia&description=Commercial+Kitchen+%26+Hospitality+Equipment+for+Saudi+Hotels+%26+Restaurants`,
    ],
  },
};

export default async function SaudiArabiaPage() {
  // Fetch latest 8 products server-side
  const { data: productsData } = await supabase
    .from("products")
    .select("*, brand:brands(*), category:categories(*), subcategory:subcategories(*)")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  // Fetch all active brands
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
      { "@type": "ListItem", position: 2, name: "Saudi Arabia", item: `${SITE_ORIGIN}/sa` },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org/",
    "@type": "LocalBusiness",
    name: "HorecaHost",
    description: country.metaDescription,
    url: `${SITE_ORIGIN}/sa`,
    telephone: "+971503079863",
    email: "info@horecahost.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
    keywords: "kitchen equipment supplier saudi arabia, commercial kitchen equipment riyadh, hospitality equipment jeddah, restaurant equipment saudi arabia, hotel kitchen equipment saudi arabia",
    sameAs: ["https://www.horecahost.com"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <CountryPage
        country={country}
        products={(productsData as ProductWithRelations[]) || []}
        brands={(brandsData as Brand[]) || []}
      />
    </>
  );
}
