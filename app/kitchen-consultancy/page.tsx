import type { Metadata } from "next";
import ConsultancyPageClient from "./ConsultancyPageClient";

export const metadata: Metadata = {
  title: "Kitchen Design & Consultancy Services | HorecaHost",
  description:
    "Professional HORECA kitchen consulting — planning, equipment recommendations, high-tech kitchen design, staff guidance, technical drawings and layouts, and expert technical support for hotels, restaurants and cafés.",
  openGraph: {
    title: "Kitchen Design & Consultancy Services | HorecaHost",
    description:
      "Professional HORECA kitchen consulting — planning, equipment recommendations, high-tech design, staff recommendations, drawings and technical support.",
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
