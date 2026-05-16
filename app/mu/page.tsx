import { Metadata } from "next";
import { getCountry } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import { ProductWithRelations, Brand } from "@/lib/types";
import CountryPage from "@/components/country/CountryPage";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

const country = getCountry("mu")!;

export const metadata: Metadata = {
  title: country.metaTitle,
  description: country.metaDescription,
  alternates: {
    canonical: `${SITE_ORIGIN}/mu`,
    languages: {
      'en-AE': `${SITE_ORIGIN}`,
      'en-MU': `${SITE_ORIGIN}/mu`,
      'en-MV': `${SITE_ORIGIN}/mv`,
    },
  },
  openGraph: {
    title: country.metaTitle,
    description: country.metaDescription,
    url: `${SITE_ORIGIN}/mu`,
    siteName: "HorecaHost",
    type: "website",
    images: [
      {
        url: `/api/og?title=Kitchen+Equipment+Suppliers+in+Mauritius&description=Commercial+Kitchen+%26+Hospitality+Equipment+for+Mauritius+Hotels+%26+Resorts`,
        width: 1200,
        height: 630,
        alt: "HorecaHost — Kitchen Equipment Suppliers in Mauritius",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      `/api/og?title=Kitchen+Equipment+Suppliers+in+Mauritius&description=Commercial+Kitchen+%26+Hospitality+Equipment+for+Mauritius+Hotels+%26+Resorts`,
    ],
  },
};

export default async function MauritiusPage() {
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
      { "@type": "ListItem", position: 2, name: "Mauritius", item: `${SITE_ORIGIN}/mu` },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org/",
    "@type": "LocalBusiness",
    name: "HorecaHost",
    description: country.metaDescription,
    url: `${SITE_ORIGIN}/mu`,
    telephone: "+971503079863",
    email: "info@horecahost.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    areaServed: { "@type": "Country", name: "Mauritius" },
    keywords: "kitchen equipment suppliers mauritius, commercial kitchen equipment mauritius, hospitality equipment mauritius, restaurant equipment mauritius, hotel kitchen equipment mauritius",
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
