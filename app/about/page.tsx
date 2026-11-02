import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About HorecaHost | HORECA Equipment & Kitchen Design",
  description: "Learn about HorecaHost, a hospitality equipment supplier with 25+ years of HORECA experience and 60+ global brands serving businesses across the UAE, Saudi Arabia, Maldives and Mauritius.",
  openGraph: {
    title: "About HorecaHost | HORECA Equipment & Kitchen Design",
    description: "Learn about HorecaHost, a hospitality equipment supplier with 25+ years of HORECA experience and 60+ global brands serving businesses across the UAE, Saudi Arabia, Maldives and Mauritius.",
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
