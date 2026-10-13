import Banner from "@/components/banner/Banner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeAbout from "@/components/about/HomeAbout";
import BrandLogosSlider from "@/components/home/BrandLogosSlider";
import AllBrandsList from "@/components/home/AllBrandsList";
import Footer from "@/components/global/Footer";
import React from "react";
import type { Metadata } from "next";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  process.env.SITE_ORIGIN ||
  "https://www.horecahost.com";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_ORIGIN,
    languages: {
      "ar-SA": `${SITE_ORIGIN}/sa/ar`,
      "en-AE": SITE_ORIGIN,
      "en-SA": `${SITE_ORIGIN}/sa`,
      "en-MU": `${SITE_ORIGIN}/mu`,
      "en-MV": `${SITE_ORIGIN}/mv`,
      "x-default": SITE_ORIGIN,
    },
  },
};

export default function page() {
  // Organization schema for homepage SEO
  const organizationSchema = {
    "@context": "https://schema.org/",
    "@type": "Organization",
    name: "HorecaHost",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/logo.png`,
    description:
      "Premium hospitality and commercial kitchen equipment supplier",
    sameAs: [
      "https://www.facebook.com/horecahost",
      "https://www.linkedin.com/company/horecahost",
      "https://twitter.com/horecahost",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Sales",
        telephone: "+971-50-307-9863",
        areaServed: ["AE", "SA", "MU", "MV"],
        availableLanguage: "en",
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        addressCountry: "AE",
        addressRegion: "Dubai",
      },
    ],
  };

  // WebSite schema with search action for SEO
  const websiteSchema = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    url: SITE_ORIGIN,
    name: "HorecaHost",
    description:
      "Premium hospitality and commercial kitchen equipment supplier",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_ORIGIN}/products?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* Organization Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      {/* WebSite Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <div>
        <Banner />
        <FeaturedProducts />
        <HomeFeatures />
        <HomeAbout />
        <BrandLogosSlider />
        <AllBrandsList />
        <Footer />
      </div>
    </>
  );
}
