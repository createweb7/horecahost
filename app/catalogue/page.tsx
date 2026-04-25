import { Metadata } from "next";
import CataloguePageClient from "@/components/catalogue/CataloguePageClient";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  process.env.SITE_ORIGIN ||
  "https://www.horecahost.com";

export const metadata: Metadata = {
  title: "Product Catalogue | HorecaHost — Premium Hospitality Equipment",
  description:
    "Browse our complete catalogue of premium hospitality and commercial kitchen equipment. Explore top brands, all categories, and hundreds of products in one place.",
  alternates: {
    canonical: `${SITE_ORIGIN}/catalogue`,
    languages: {
      "ar": `${SITE_ORIGIN}/ar/catalogue`,
    },
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Product Catalogue | HorecaHost",
    description:
      "Browse our complete range of premium hospitality and commercial kitchen equipment from the world's leading brands.",
    url: `${SITE_ORIGIN}/catalogue`,
    siteName: "HorecaHost",
    type: "website",
    images: [
      {
        url: `/api/og?title=Product+Catalogue&description=Premium+Hospitality+%26+Kitchen+Equipment`,
        width: 1200,
        height: 630,
        alt: "HorecaHost Product Catalogue",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`/api/og?title=Product+Catalogue&description=Premium+Hospitality+%26+Kitchen+Equipment`],
  },
};

export default function CataloguePage() {
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
        name: "Catalogue",
        item: `${SITE_ORIGIN}/catalogue`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    name: "HorecaHost Product Catalogue",
    description:
      "Complete catalogue of premium hospitality and commercial kitchen equipment",
    url: `${SITE_ORIGIN}/catalogue`,
    provider: {
      "@type": "Organization",
      name: "HorecaHost",
      url: SITE_ORIGIN,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <CataloguePageClient locale="en" />
    </>
  );
}
