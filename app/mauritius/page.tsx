import { Metadata } from "next";
import CountryPage from "@/components/country/CountryPage";
import { getCountry } from "@/lib/countries";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

const country = getCountry("mauritius")!;

export const metadata: Metadata = {
  title: country.metaTitle,
  description: country.metaDescription,
  alternates: {
    canonical: `${SITE_ORIGIN}/mauritius`,
  },
  openGraph: {
    title: country.metaTitle,
    description: country.metaDescription,
    url: `${SITE_ORIGIN}/mauritius`,
    siteName: "HorecaHost",
    type: "website",
    images: [
      {
        url: `/api/og?title=Hospitality+Equipment+Mauritius&description=Premium+HORECA+Equipment+for+Mauritius+Hotels+%26+Resorts`,
        width: 1200,
        height: 630,
        alt: "HorecaHost — Hospitality Equipment for Mauritius",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`/api/og?title=Hospitality+Equipment+Mauritius&description=Premium+HORECA+Equipment+for+Mauritius+Hotels+%26+Resorts`],
  },
};

export default function MauritiusPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Mauritius", item: `${SITE_ORIGIN}/mauritius` },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org/",
    "@type": "LocalBusiness",
    name: "HorecaHost",
    description: country.metaDescription,
    url: `${SITE_ORIGIN}/mauritius`,
    telephone: "+971503079863",
    email: "info@horecahost.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    areaServed: {
      "@type": "Country",
      name: "Mauritius",
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
