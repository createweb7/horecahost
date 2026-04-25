import { Metadata } from "next";
import CataloguePageClient from "@/components/catalogue/CataloguePageClient";

const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ||
  process.env.SITE_ORIGIN ||
  "https://www.horecahost.com";

export const metadata: Metadata = {
  title: "كتالوج المنتجات | هوريكاهوست — معدات الضيافة الفاخرة",
  description:
    "تصفح كتالوجنا الكامل من معدات الضيافة والمطابخ التجارية الفاخرة. استكشف أفضل العلامات التجارية وجميع الفئات والمئات من المنتجات في مكان واحد.",
  alternates: {
    canonical: `${SITE_ORIGIN}/ar/catalogue`,
    languages: {
      "en": `${SITE_ORIGIN}/catalogue`,
    },
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "كتالوج المنتجات | هوريكاهوست",
    description:
      "تصفح مجموعتنا الكاملة من معدات الضيافة والمطابخ التجارية الفاخرة من أفضل العلامات التجارية العالمية.",
    url: `${SITE_ORIGIN}/ar/catalogue`,
    siteName: "HorecaHost",
    type: "website",
  },
};

export default function CataloguePageAr() {
  const breadcrumbSchema = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: `${SITE_ORIGIN}/ar`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "الكتالوج",
        item: `${SITE_ORIGIN}/ar/catalogue`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CataloguePageClient locale="ar" />
    </>
  );
}
