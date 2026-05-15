export interface CountryConfig {
  slug: string
  name: string
  code: string
  capital: string
  demonym: string
  flag: string
  region: string
  // SEO
  metaTitle: string
  metaDescription: string
  // Page content
  heroTitle: string
  heroSubtitle: string
  intro: string[]
  industries: { name: string; icon: string; description: string }[]
  whyUs: { title: string; description: string; icon: string }[]
  // Shipping / local context
  shippingNote: string
  enquiryNote: string
}

export const countries: CountryConfig[] = [
  {
    slug: "maldives",
    name: "Maldives",
    code: "MV",
    capital: "Malé",
    demonym: "Maldivian",
    flag: "🇲🇻",
    region: "Indian Ocean",
    metaTitle:
      "Commercial Kitchen & Hospitality Equipment Maldives | HorecaHost",
    metaDescription:
      "HorecaHost supplies premium commercial kitchen and hospitality equipment to Maldives resorts, hotels, and restaurants. Trusted by leading island resorts. Enquire today.",
    heroTitle: "Premium Hospitality Equipment for Maldives Resorts & Hotels",
    heroSubtitle:
      "Supplying world-class commercial kitchen and hospitality equipment to luxury resorts, overwater villas, and hotels across the Maldives — delivered reliably to your island.",
    intro: [
      "The Maldives is home to some of the world's most prestigious luxury resorts and overwater bungalows, demanding the highest standards in hospitality equipment. HorecaHost understands the unique requirements of island-based hospitality operations — from remote atoll resorts to the bustling dining scene in Malé.",
      "We supply a comprehensive range of commercial kitchen equipment, refrigeration systems, food service equipment, and hospitality solutions to Maldivian properties. Our extensive portfolio of 60+ global brands ensures that every resort, hotel, and restaurant in the Maldives has access to the same world-class equipment used by top establishments in Dubai and beyond.",
      "With reliable international shipping and a dedicated supply chain experienced in island logistics, HorecaHost makes it seamless for Maldives-based hospitality businesses to source premium equipment without compromise.",
    ],
    industries: [
      {
        name: "Luxury Resorts",
        icon: "🏝️",
        description:
          "Full kitchen fit-outs for overwater and island resorts with multiple dining outlets",
      },
      {
        name: "Hotels",
        icon: "🏨",
        description:
          "Complete hospitality equipment solutions for Malé and island hotels",
      },
      {
        name: "Restaurants & Cafés",
        icon: "🍽️",
        description:
          "Commercial kitchen equipment for standalone restaurants and resort dining venues",
      },
      {
        name: "Catering & Events",
        icon: "🎪",
        description:
          "Mobile and event catering equipment for beach events and destination weddings",
      },
    ],
    whyUs: [
      {
        icon: "🌍",
        title: "60+ Global Brands",
        description:
          "Access to the world's leading hospitality equipment brands — all from one trusted supplier based in Dubai.",
      },
      {
        icon: "🚢",
        title: "Island Delivery Experience",
        description:
          "Experienced in international shipping to island destinations including remote atolls across the Maldives.",
      },
      {
        icon: "⚡",
        title: "Expert Consultation",
        description:
          "Our specialists help you choose the right equipment for your resort or hotel's specific requirements and capacity.",
      },
    ],
    shippingNote: "We ship to all islands across the Maldives including remote atolls.",
    enquiryNote:
      "Planning a resort fit-out or kitchen upgrade in the Maldives? Our team will prepare a tailored quote for your property.",
  },
  {
    slug: "mauritius",
    name: "Mauritius",
    code: "MU",
    capital: "Port Louis",
    demonym: "Mauritian",
    flag: "🇲🇺",
    region: "Indian Ocean",
    metaTitle:
      "Commercial Kitchen & Hospitality Equipment Mauritius | HorecaHost",
    metaDescription:
      "HorecaHost supplies premium commercial kitchen and hospitality equipment to Mauritius hotels, resorts, and restaurants. Serving Port Louis and island-wide. Enquire today.",
    heroTitle: "Premium Hospitality Equipment for Mauritius Hotels & Restaurants",
    heroSubtitle:
      "Supplying world-class commercial kitchen and hospitality equipment to hotels, beach resorts, and restaurants across Mauritius — from Port Louis to Grand Baie.",
    intro: [
      "Mauritius has established itself as one of the Indian Ocean's premier tourism and hospitality destinations, with a thriving hotel industry, world-class beach resorts, and a vibrant restaurant scene. HorecaHost is proud to serve Mauritian hospitality businesses with the same premium equipment trusted by leading establishments across the Middle East and Indian Ocean.",
      "From five-star beach resorts in Grand Baie and Flic en Flac to busy restaurants and catering operations in Port Louis, we supply a complete range of commercial kitchen equipment, refrigeration systems, bakery equipment, and food service solutions. Our portfolio of 60+ international brands gives Mauritius hospitality operators access to equipment used in the world's finest establishments.",
      "Our supply chain to Mauritius is well-established, with reliable shipping and a team that understands the pace and demands of the island's hospitality sector. Whether you are fitting out a new hotel or upgrading an existing kitchen, HorecaHost delivers on quality, reliability, and value.",
    ],
    industries: [
      {
        name: "Beach Resorts",
        icon: "🏖️",
        description:
          "Full kitchen and bar equipment for luxury beach resorts and spa hotels",
      },
      {
        name: "Hotels",
        icon: "🏨",
        description:
          "Complete hospitality solutions for business and leisure hotels across Mauritius",
      },
      {
        name: "Restaurants & Bars",
        icon: "🍽️",
        description:
          "Commercial kitchen equipment for fine dining, beach bars, and casual restaurants",
      },
      {
        name: "Catering & Bakeries",
        icon: "🥐",
        description:
          "Professional bakery and catering equipment for Mauritius food businesses",
      },
    ],
    whyUs: [
      {
        icon: "🌍",
        title: "60+ Global Brands",
        description:
          "One source for the world's most trusted hospitality equipment brands — delivered to Mauritius.",
      },
      {
        icon: "🚢",
        title: "Reliable Shipping to Mauritius",
        description:
          "Established shipping routes to Port Louis with experience in island logistics and customs clearance.",
      },
      {
        icon: "⚡",
        title: "End-to-End Support",
        description:
          "From equipment selection to after-sales support, our team is with you at every stage of your project.",
      },
    ],
    shippingNote: "We ship to Port Louis and all regions across Mauritius.",
    enquiryNote:
      "Planning a hotel fit-out or restaurant kitchen upgrade in Mauritius? Contact our team for a tailored quote.",
  },
]

export function getCountry(slug: string): CountryConfig | undefined {
  return countries.find((c) => c.slug === slug)
}
