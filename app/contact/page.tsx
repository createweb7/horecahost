import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact HorecaHost - Get in Touch with Our Team",
  description: "Have questions about our hospitality equipment? Contact HorecaHost across UAE, India, and internationally. Fast response times, expert support.",
  openGraph: {
    title: "Contact HorecaHost - Get in Touch with Our Team",
    description: "Have questions about our hospitality equipment? Contact HorecaHost across UAE, India, and internationally.",
    type: "website",
    url: "/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
