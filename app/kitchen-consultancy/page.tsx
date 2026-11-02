import type { Metadata } from "next";
import ConsultancyPageClient from "./ConsultancyPageClient";

export const metadata: Metadata = {
  title: "Commercial Kitchen Design & Consultancy | HorecaHost",
  description:
    "Plan your hotel, restaurant or café kitchen with HorecaHost. Get commercial kitchen layouts, equipment selection, technical drawings and project support.",
  openGraph: {
    title: "Commercial Kitchen Design & Consultancy | HorecaHost",
    description:
      "Commercial kitchen planning, efficient layouts, equipment selection and technical drawings for hospitality projects across the UAE, Saudi Arabia, Maldives and Mauritius.",
    type: "website",
    url: "/kitchen-consultancy",
  },
  alternates: {
    canonical: "/kitchen-consultancy",
  },
};

export default function KitchenConsultancyPage() {
  return <ConsultancyPageClient />;
}
