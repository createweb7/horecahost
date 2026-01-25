import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About HorecaHost - Premium Hospitality Equipment Supplier",
  description: "Learn about HorecaHost's mission to supply premium hospitality and commercial kitchen equipment. Trusted partner for restaurants, hotels, and catering businesses worldwide.",
  openGraph: {
    title: "About HorecaHost - Premium Hospitality Equipment Supplier",
    description: "Learn about HorecaHost's mission to supply premium hospitality and commercial kitchen equipment.",
    type: "website",
    url: "/about",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
