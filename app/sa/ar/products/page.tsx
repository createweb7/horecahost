import type { Metadata } from "next";
import ArabicProductsPage from "@/app/ar/products/page";

const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";
const title = "معدات المطابخ والضيافة في السعودية | هوريكا هوست";
const description = "تصفح معدات المطاعم والفنادق والمقاهي في السعودية وابحث عن المنتجات والعلامات التجارية المناسبة لمشروعك.";

export const metadata: Metadata = {
  title, description,
  alternates: {
    canonical: `${origin}/sa/ar/products`,
    languages: {
      "en-AE": `${origin}/products`, "en-SA": `${origin}/sa/products`,
      "ar-SA": `${origin}/sa/ar/products`, "en-MV": `${origin}/mv/products`,
      "en-MU": `${origin}/mu/products`, "x-default": `${origin}/products`,
    },
  },
  openGraph: { title, description, url: `${origin}/sa/ar/products`, locale: "ar_SA" },
  twitter: { title, description },
};

export default function SaudiArabicProductsPage() {
  return <div lang="ar" dir="rtl"><ArabicProductsPage /></div>;
}
