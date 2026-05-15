export interface CountryFAQ {
  question: string
  answer: string
}

export interface SlugSEOOverride {
  metaTitle?: string
  metaDescription?: string
  h1?: string
  heroSubtitle?: string
}

export interface CountryConfig {
  slug: string        // ISO country code used in URL e.g. "mv", "mu"
  name: string
  code: string        // same as slug
  capital: string
  flag: string
  // SEO
  metaTitle: string
  metaDescription: string
  // Hero
  heroTitle: string
  heroSubtitle: string
  // Body
  intro: string[]
  industries: { name: string; icon: string; description: string }[]
  whyUs: { title: string; description: string; icon: string }[]
  shippingNote: string
  enquiryNote: string
  // Country-specific FAQ (used on product + category pages)
  faq: CountryFAQ[]
  // Per-slug SEO overrides for high-value keyword targeting
  seoOverrides?: Record<string, SlugSEOOverride>
}

export const countries: CountryConfig[] = [
  {
    slug: "mv",
    name: "Maldives",
    code: "MV",
    capital: "Malé",
    flag: "🇲🇻",
    metaTitle:
      "Commercial Kitchen Equipment Supplier in Maldives | HorecaHost",
    metaDescription:
      "HorecaHost supplies premium commercial kitchen and hospitality equipment to resorts, hotels, and restaurants across the Maldives. Trusted by leading island properties. Enquire today.",
    heroTitle:
      "Commercial Kitchen Equipment Supplier for Resorts and Hotels in Maldives",
    heroSubtitle:
      "Supplying premium kitchen and hospitality solutions for luxury resorts, overwater villas, and hotels across the Maldives.",
    intro: [
      "The Maldives is home to some of the world's most prestigious luxury resorts and overwater bungalows, demanding the highest standards in hospitality equipment. HorecaHost understands the unique requirements of island-based hospitality operations — from remote atoll resorts to the dining scene in Malé.",
      "We supply a comprehensive range of commercial kitchen equipment, refrigeration systems, food service equipment, and hospitality solutions to Maldivian properties. Our extensive portfolio of 60+ global brands ensures that every resort, hotel, and restaurant in the Maldives has access to the same world-class equipment trusted by top establishments across the Middle East and Indian Ocean.",
      "With reliable international shipping and a dedicated supply chain experienced in island logistics, HorecaHost makes it seamless for Maldives hospitality businesses to source premium equipment without compromise.",
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
    shippingNote:
      "We ship to all islands across the Maldives including remote atolls.",
    enquiryNote:
      "Planning a resort fit-out or kitchen upgrade in the Maldives? Our team will prepare a tailored quote for your property.",
    faq: [
      {
        question: "Do you ship commercial kitchen equipment to the Maldives?",
        answer:
          "Yes, HorecaHost ships to Malé and all atolls across the Maldives. We have extensive experience delivering to remote island resorts and understand the logistics of island-based hospitality operations, including last-mile delivery to outer atolls.",
      },
      {
        question: "What is the typical delivery lead time to the Maldives?",
        answer:
          "Delivery to the Maldives typically takes 4–8 weeks depending on product availability and shipping schedule from Dubai. For remote atolls, additional transit time may be required for the final leg. We confirm the full timeline at the time of order.",
      },
      {
        question: "Do you provide warranty and after-sales support for Maldives resorts?",
        answer:
          "Yes, all equipment carries the full manufacturer's warranty. Our team provides remote support and can coordinate with local service partners in the Maldives for on-site assistance when required.",
      },
      {
        question: "What payment terms are available for Maldives buyers?",
        answer:
          "We offer bank transfer and letter of credit payment options for Maldives-based buyers. Our team is happy to discuss payment terms that fit your resort's procurement process — contact us to arrange.",
      },
      {
        question: "Can you supply equipment for a full resort kitchen fit-out in the Maldives?",
        answer:
          "Absolutely. We regularly supply complete kitchen fit-outs for Maldives luxury resorts, from combi ovens and refrigeration to dishwashers and bar equipment. Our specialists can help specify the right equipment for your resort's capacity and cuisine requirements.",
      },
    ],
  },
  {
    slug: "mu",
    name: "Mauritius",
    code: "MU",
    capital: "Port Louis",
    flag: "🇲🇺",
    metaTitle:
      "Kitchen Equipment Suppliers in Mauritius | HorecaHost",
    metaDescription:
      "HorecaHost are trusted kitchen equipment suppliers in Mauritius, serving hotels, beach resorts and restaurants with commercial kitchen, refrigeration and hospitality equipment. Based in Dubai. Enquire today.",
    heroTitle:
      "Commercial Kitchen Equipment Suppliers in Mauritius",
    heroSubtitle:
      "Trusted kitchen equipment suppliers for hotels, beach resorts, and restaurants across Mauritius — from Port Louis to Grand Baie. 60+ global brands, reliable shipping.",
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
    seoOverrides: {
      "dish-washing-machine": {
        metaTitle: "Dishwasher Mauritius | Commercial Dishwashers | HorecaHost",
        metaDescription:
          "Leading supplier of commercial dishwashers in Mauritius. Undercounter, hood-type and conveyor dishwashers for hotels, beach resorts and restaurants. Trusted brands. Enquire today.",
        h1: "Commercial Dishwashers in Mauritius",
        heroSubtitle:
          "Professional dishwashers for hotels, beach resorts and restaurants across Mauritius. Undercounter, hood-type and conveyor models — all available for delivery to Port Louis.",
      },
      "catering-equipment": {
        metaTitle: "Catering Equipment Mauritius | HorecaHost",
        metaDescription:
          "HorecaHost supplies professional catering equipment to hotels, resorts and events businesses across Mauritius. 60+ global brands. Reliable shipping to Port Louis. Enquire today.",
        h1: "Catering Equipment Suppliers in Mauritius",
        heroSubtitle:
          "Complete catering equipment solutions for hotels, beach resorts, restaurants and events businesses across Mauritius — from Port Louis to Grand Baie.",
      },
      "bakery-equipment": {
        metaTitle: "Bakery Equipment Mauritius | Professional Bakery Machines | HorecaHost",
        metaDescription:
          "Commercial bakery equipment suppliers in Mauritius. Ovens, mixers, proofers and more for hotels, bakeries and restaurants. Delivered to Port Louis. Enquire today.",
        h1: "Bakery Equipment Suppliers in Mauritius",
        heroSubtitle:
          "Professional bakery equipment for hotels, beach resorts and standalone bakeries across Mauritius. Deck ovens, spiral mixers, proofers and more.",
      },
    },
    faq: [
      {
        question: "Do you ship commercial kitchen equipment to Mauritius?",
        answer:
          "Yes, HorecaHost ships to Port Louis and all regions across Mauritius. We have established shipping routes and full experience with customs clearance into Mauritius, making the import process straightforward for your business.",
      },
      {
        question: "What is the typical delivery lead time to Mauritius?",
        answer:
          "Delivery to Mauritius typically takes 4–8 weeks depending on product availability and the shipping schedule from Dubai. We will confirm the exact timeline when you place your order so your project schedule is not affected.",
      },
      {
        question: "Do you provide warranty and after-sales support in Mauritius?",
        answer:
          "Yes, all equipment comes with the full manufacturer's warranty. Our team provides after-sales support and can coordinate with local service partners in Mauritius for any on-site servicing or spare parts requirements.",
      },
      {
        question: "What payment terms are available for Mauritius buyers?",
        answer:
          "We offer flexible payment terms for Mauritius-based buyers including bank transfer and letter of credit. Contact our team to discuss the terms most suitable for your hotel, resort, or restaurant business.",
      },
      {
        question: "Can you provide a customised quote for my hotel or restaurant in Mauritius?",
        answer:
          "Absolutely. Our team specialises in hospitality equipment packages for Mauritius hotels, beach resorts, and restaurants. Reach out with your requirements — kitchen layout, capacity, and cuisine type — and we will prepare a tailored quotation.",
      },
    ],
  },
]

export function getCountry(slug: string): CountryConfig | undefined {
  return countries.find((c) => c.slug === slug)
}
