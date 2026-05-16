import { Metadata } from "next";
import ProductsPageClient from "./ProductsPageClient";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  process.env.SITE_ORIGIN ||
  "https://www.horecahost.com";

export const metadata: Metadata = {
  title: "Products | HorecaHost",
  description:
    "Browse our comprehensive catalog of premium hospitality and commercial kitchen equipment.",
  alternates: {
    canonical: `${SITE_ORIGIN}/products`,
    languages: {
      'en-AE': `${SITE_ORIGIN}/products`,
      'en-MU': `${SITE_ORIGIN}/mu/products`,
      'en-MV': `${SITE_ORIGIN}/mv/products`,
    },
  },
};

export default function ProductsPage() {
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
      <ProductsPageClient />
    </>
  );
}
