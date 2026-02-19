import type { Metadata } from "next";
import BrandsPageClient from "./BrandsPageClient";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  process.env.SITE_ORIGIN ||
  "https://www.horecahost.com";

export const metadata: Metadata = {
  title: "Brands - Browse Premium Hospitality Equipment Brands | HorecaHost",
  description: "Explore our curated selection of premium brands supplying hospitality and commercial kitchen equipment. Find trusted equipment manufacturers for your business.",
  openGraph: {
    title: "Brands - Browse Premium Hospitality Equipment Brands | HorecaHost",
    description: "Explore our curated selection of premium brands supplying hospitality and commercial kitchen equipment.",
    type: "website",
    url: "/brands",
  },
  alternates: {
    canonical: "/brands",
  },
};

export default function BrandsPage() {
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
      <BrandsPageClient />
    </>
  );
}
