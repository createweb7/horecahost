import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About HorecaHost",
  description: "The Engine Behind World-Class Hospitality. 25 Years of Experience. 60+ Global Brands. One Standard of Excellence.",
  openGraph: {
    title: "About HorecaHost",
    description: "The Engine Behind World-Class Hospitality. 25 Years of Experience. 60+ Global Brands. One Standard of Excellence.",
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
