import type { Metadata } from "next";
import BrandsPageClient from "./BrandsPageClient";

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
  return <BrandsPageClient />;
}
