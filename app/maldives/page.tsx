import { Metadata } from "next";
import CountryPage from "@/components/country/CountryPage";
import { getCountry } from "@/lib/countries";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

const country = getCountry("maldives")!;

export const metadata: Metadata = {
  title: country.metaTitle,
  description: country.metaDescription,
  alternates: {
    canonical: `${SITE_ORIGIN}/maldives`,
  },
  openGraph: {
    title: country.metaTitle,
    description: country.metaDescription,
    url: `${SITE_ORIGIN}/maldives`,
    siteName: "HorecaHost",
    type: "website",
    images: [
      {
        url: `/api/og?title=Hospitality+Equipment+Maldives&description=Premium+HORECA+Equipment+for+Maldives+Resorts+%26+Hotels`,
        width: 1200,
        height: 630,
        alt: "HorecaHost — Hospitality Equipment for Maldives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`/api/og?title=Hospitality+Equipment+Maldives&description=Premium+HORECA+Equipment+for+Maldives+Resorts+%26+Hotels`],
  },
};

export default function MaldivesPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Maldives", item: `${SITE_ORIGIN}/maldives` },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org/",
    "@type": "LocalBusiness",
    name: "HorecaHost",
    description: country.metaDescription,
    url: `${SITE_ORIGIN}/maldives`,
    telephone: "+971503079863",
    email: "info@horecahost.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    areaServed: {
      "@type": "Country",
      name: "Maldives",
    },
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
      <CountryPage country={country} />
    </>
  );
}
