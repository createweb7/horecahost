import Banner from "@/components/banner/Banner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeAbout from "@/components/about/HomeAbout";
import BrandLogosSlider from "@/components/home/BrandLogosSlider";
import AllBrandsList from "@/components/home/AllBrandsList";
import Footer from "@/components/global/Footer";
import React from "react";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.SITE_ORIGIN || "http://localhost:3000";

export default function page() {
  // Organization schema for homepage SEO
  const organizationSchema = {
    "@context": "https://schema.org/",
    "@type": "Organization",
    name: "HorecaHost",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/logo.png`,
    description: "Premium hospitality and commercial kitchen equipment supplier",
    sameAs: [
      "https://www.facebook.com/horecahost",
      "https://www.linkedin.com/company/horecahost",
      "https://twitter.com/horecahost",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Sales",
        telephone: "+971-XXXXXXXXX",
        areaServed: "AE",
        availableLanguage: "en",
      },
      {
        "@type": "ContactPoint",
        contactType: "Sales",
        telephone: "+91-XXXXXXXXX",
        areaServed: "IN",
        availableLanguage: "en",
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        addressCountry: "AE",
        addressRegion: "Dubai",
        postalCode: "00000",
      },
      {
        "@type": "PostalAddress",
        addressCountry: "IN",
        postalCode: "00000",
      },
    ],
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
