"use client";

import { useState } from "react";
import Image from "next/image";
import Script from "next/script";
import Footer from "@/components/global/Footer";
import { FaWhatsapp } from "react-icons/fa";
import {
  User,
  Phone,
  Mail,
  Building2,
  MessageSquare,
  ChevronRight,
  UtensilsCrossed,
  Coffee,
  ChefHat,
  FileText,
  Lightbulb,
  Settings,
  Box,
  Users,
  Headset,
  Search,
  CheckCircle2,
  Zap,
  BarChart3,
  Compass,
} from "lucide-react";

const WHATSAPP_NUMBER = "+971503079863";
const WHATSAPP_LINK = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;

const PROJECT_TYPES = [
  "New Restaurant",
  "Hotel Kitchen",
  "Café / Bakery",
  "Catering Facility",
  "Kitchen Renovation",
  "Other",
];

const NICHES = [
  { icon: Building2, label: "Hotels" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Coffee, label: "Cafés" },
  { icon: ChefHat, label: "Catering" },
];

const SERVICES = [
  {
    icon: FileText,
    title: "Planning & Concept",
    description:
      "End-to-end kitchen project planning tailored to your concept, volume and budget — with ideas and suggestions along the way.",
  },
  {
    icon: Lightbulb,
    title: "Kitchen Design",
    description:
      "Modern, efficient layouts that bring together workflow, safety and the latest kitchen technology.",
  },
  {
    icon: Settings,
    title: "Equipment Selection",
    description:
      "Guidance on the right commercial equipment for maximum productivity and reliability.",
  },
  {
    icon: Box,
    title: "Drawings & Layouts",
    description:
      "Detailed technical drawings and layout plans ready for fit-out and equipment installation.",
  },
  {
    icon: Users,
    title: "Staff & Workflow",
    description:
      "Guidance on staffing and workflow so your team can operate the space safely and efficiently.",
  },
  {
    icon: Headset,
    title: "Technical Support",
    description:
      "Dedicated technical support throughout your project, from first concept to final handover.",
  },
];

const PROCESS_STEPS = [
  {
    icon: Search,
    number: "01",
    title: "Understand",
    description: "We learn about your concept, menu, space and budget.",
  },
  {
    icon: FileText,
    number: "02",
    title: "Plan",
    description: "We develop the optimal layout, workflow and equipment strategy.",
  },
  {
    icon: Box,
    number: "03",
    title: "Specify",
    description: "We guide you in selecting the right equipment and prepare technical drawings.",
  },
  {
    icon: CheckCircle2,
    number: "04",
    title: "Support",
    description: "We provide ongoing technical support until final handover.",
  },
];

const WHY_US = [
  {
    icon: Zap,
    title: "Efficient workflow",
    description: "Layouts that improve productivity and safety.",
  },
  {
    icon: BarChart3,
    title: "Smarter investment",
    description: "Practical advice to get the best value from your budget.",
  },
  {
    icon: Users,
    title: "Practical expertise",
    description: "Real-world experience across a wide range of hospitality projects.",
  },
  {
    icon: Compass,
    title: "End-to-end guidance",
    description: "From concept and design to equipment selection and final handover.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org/",
  "@type": "Service",
  serviceType: "Kitchen Design & Consultancy",
  name: "HorecaHost Kitchen Design & Consultancy",
  provider: {
    "@type": "Organization",
    name: "HorecaHost",
    url: "https://www.horecahost.com",
  },
  areaServed: [
    "United Arab Emirates",
    "United States",
    "Malaysia",
    "Italy",
    "Mauritius",
    "Bahrain",
    "Qatar",
    "India",
    "Saudi Arabia",
  ],
  description:
    "Professional HORECA kitchen consulting services covering planning, concept development, professional equipment recommendations, high-tech kitchen design, staffing guidance, technical drawings and layouts, and ongoing technical support.",
  url: "https://www.horecahost.com/kitchen-consultancy",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Kitchen Consultancy Services",
    itemListElement: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.title },
    })),
  },
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  phone: "",
  projectType: "",
  message: "",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="w-8 h-0.5 bg-red-600" />
      <span className="text-xs font-semibold tracking-widest text-red-600 uppercase">
        {children}
      </span>
    </div>
  );
}

export default function ConsultancyPageClient() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [heroErrors, setHeroErrors] = useState<{ [key: string]: string }>({});
  const [heroTouched, setHeroTouched] = useState<{ [key: string]: boolean }>({});
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [heroSubmitError, setHeroSubmitError] = useState<string | null>(null);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        if (!/^[\d\s+\-()]{10,}$/.test(value.replace(/\s/g, ""))) {
          return "Please enter a valid phone number (at least 10 digits)";
        }
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleHeroBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setHeroTouched((prev) => ({ ...prev, [name]: true }));
    setHeroErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const getRecaptchaToken = async (action: string): Promise<string> => {
    if (typeof window !== "undefined" && window.grecaptcha) {
      return window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
        { action }
      );
    }
    return "";
  };

  const handleHeroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHeroSubmitError(null);

    const fieldsToValidate: (keyof FormData)[] = ["name", "email", "phone"];
    const newErrors: { [key: string]: string } = {};
    const newTouched: { [key: string]: boolean } = {};
    fieldsToValidate.forEach((key) => {
      newTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setHeroTouched((prev) => ({ ...prev, ...newTouched }));
    setHeroErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setHeroLoading(true);
    try {
      const recaptchaToken = await getRecaptchaToken("enquiry");

      const message = formData.projectType
        ? `Quick enquiry from the Kitchen Consultancy page.\nProject type: ${formData.projectType}`
        : "Quick enquiry submitted from the Kitchen Consultancy page.";

      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message,
          source: "quick",
          recaptchaToken,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send your request");

      setHeroSubmitted(true);
      setFormData(INITIAL_FORM);
      setErrors({});
      setTouched({});
      setHeroErrors({});
      setHeroTouched({});
      setTimeout(() => setHeroSubmitted(false), 6000);
    } catch (err) {
      setHeroSubmitError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setHeroLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const fieldsToValidate: (keyof FormData)[] = ["name", "email", "phone", "message"];
    const newErrors: { [key: string]: string } = {};
    const newTouched: { [key: string]: boolean } = {};
    fieldsToValidate.forEach((key) => {
      newTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const recaptchaToken = await getRecaptchaToken("enquiry");

      const combinedMessage = formData.projectType
        ? `Project type: ${formData.projectType}\n\n${formData.message}`
        : formData.message;

      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: combinedMessage,
          source: "consultation",
          recaptchaToken,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send your enquiry");

      setSubmitted(true);
      setFormData(INITIAL_FORM);
      setErrors({});
      setTouched({});
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />
      <Script
        id="kitchen-consultancy-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Hero */}
      <div className="relative overflow-hidden py-20 lg:py-28">
        <Image
          src="/kitchen-consultancy/hero-kitchen.webp"
          alt="Professional commercial kitchen designed by HorecaHost"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 items-center">
            {/* Left: copy */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-0.5 bg-red-600" />
                <span className="text-xs font-semibold tracking-widest text-red-500 uppercase">
                  Kitchen Design &amp; Consultancy
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
                Exceptional kitchens.
                <br />
                Designed for performance.
              </h1>
              <p className="text-lg text-gray-300 max-w-xl mb-8">
                Expert planning, equipment guidance and technical support for
                your next hospitality project.
              </p>
              <div className="flex items-center gap-3">
                <span className="w-10 h-0.5 bg-red-600" />
                <span className="text-xs font-semibold tracking-widest text-gray-300 uppercase">
                  25 Years of Experience
                </span>
              </div>
            </div>

            {/* Right: quick-start card */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1.5">
                Let&apos;s plan your kitchen.
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Tell us about your project and our experts will get back to
                you shortly.
              </p>

              {heroSubmitted && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-semibold">
                    ✓ Thanks! We&apos;ve received your request and will be in
                    touch shortly.
                  </p>
                </div>
              )}
              {heroSubmitError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-semibold">✗ {heroSubmitError}</p>
                </div>
              )}

              <form onSubmit={handleHeroSubmit} noValidate>
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleHeroBlur}
                        placeholder="Your name"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          heroErrors.name && heroTouched.name ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {heroErrors.name && heroTouched.name && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{heroErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleHeroBlur}
                        placeholder="Email address"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          heroErrors.email && heroTouched.email ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {heroErrors.email && heroTouched.email && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{heroErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleHeroBlur}
                        placeholder="Phone / WhatsApp"
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                          heroErrors.phone && heroTouched.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {heroErrors.phone && heroTouched.phone && (
                      <p className="text-red-600 text-xs mt-1 font-medium">{heroErrors.phone}</p>
                    )}
                  </div>

                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
                    >
                      <option value="">Project type</option>
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
                  Protected by reCAPTCHA — Google{" "}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
                    Privacy Policy
                  </a>{" "}
                  &amp;{" "}
                  <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
                    Terms
                  </a>{" "}
                  apply.
                </p>

                <button
                  type="submit"
                  disabled={heroLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {heroLoading ? "Sending..." : "Request a Consultation"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-xs text-gray-400">or</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
                Prefer to chat? WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Niche strip */}
      <div className="bg-gray-50 border-b border-gray-200 py-6">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 sm:gap-4 sm:divide-x divide-gray-200">
            {NICHES.map((niche) => (
              <div
                key={niche.label}
                className="flex items-center justify-center gap-2.5"
              >
                <niche.icon className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-sm font-medium text-gray-700">
                  {niche.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="bg-white">
        {/* About */}
        <section className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Blueprint + kitchen photo composition */}
            <div className="relative h-80 sm:h-96">
              <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/kitchen-consultancy/blueprint.webp"
                  alt="Commercial kitchen layout drafting"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 w-36 h-28 sm:w-48 sm:h-36 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="/kitchen-consultancy/about-kitchen.webp"
                  alt="Finished commercial restaurant kitchen"
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <SectionLabel>About Horeca Host</SectionLabel>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                A better kitchen starts with a smarter plan.
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed mb-8">
                <p>
                  At HORECA HOST Consulting, we bridge the gap between
                  culinary vision and practical execution. Our consultants
                  design highly functional, safe and efficient kitchen
                  spaces for restaurants, hotels, cafés and catering
                  operations.
                </p>
                <p>
                  With a focus on quality, performance and project
                  deliverables, we provide innovative concepts, technical
                  drawings and expert guidance tailored to your business
                  needs.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="inline-flex items-center gap-1 text-xs font-semibold tracking-widest text-gray-900 uppercase border-t border-gray-300 pt-4 hover:text-red-600 transition-colors"
              >
                Learn more about our consultancy
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="bg-gray-50 py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-12">
              <div>
                <SectionLabel>Our Services</SectionLabel>
                <h2 className="text-3xl font-bold text-gray-900">
                  Expertise at every stage.
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed lg:text-right">
                From concept to completion, our kitchen consultants provide
                end-to-end support to help you build a kitchen that performs
                as well as it looks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((service) => (
                <div
                  key={service.title}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section id="process" className="bg-gray-900 py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-16">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-0.5 bg-red-600" />
                  <span className="text-xs font-semibold tracking-widest text-red-500 uppercase">
                    Our Process
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-white">
                  From first sketch to final handover.
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed lg:text-right">
                A structured, collaborative process to ensure your kitchen is
                designed with efficiency, productivity, safety and long-term
                operational success.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {PROCESS_STEPS.map((step) => (
                <div key={step.number}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl font-bold text-gray-700">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-full border border-gray-700 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why work with us */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionLabel>Why Work With Us</SectionLabel>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Designed around your business.
                </h2>
                <p className="text-gray-600 leading-relaxed mb-10">
                  Our consultancy is built on practical experience and a deep
                  understanding of the demands of commercial kitchens.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-10">
                  {WHY_US.map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <item.icon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-4 sm:gap-8 border-t border-gray-200 pt-6">
                  {[
                    { value: "25+", label: "Years of Experience" },
                    { value: "60+", label: "Global Brands" },
                    { value: "8+", label: "Countries Served" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-bold text-gray-900 leading-none mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-80 sm:h-[26rem] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/kitchen-consultancy/why-us-kitchen.webp"
                  alt="Industrial stainless steel commercial kitchen"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Consultation form */}
        <section id="consultation-form" className="bg-gray-50 py-20">
          <div className="mx-auto max-w-6xl xl:max-w-7xl px-6 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="w-8 h-0.5 bg-red-600" />
                <span className="text-xs font-semibold tracking-widest text-red-600 uppercase">
                  Get In Touch
                </span>
                <span className="w-8 h-0.5 bg-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tell us what you&apos;re planning.
              </h2>
              <p className="text-gray-600">
                Our kitchen consultants will get back to you with planning
                guidance, equipment recommendations and next steps.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10">
              <div>
                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold text-sm">
                      ✓ Enquiry sent successfully! Our kitchen consultants
                      will get back to you soon.
                    </p>
                  </div>
                )}
                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-semibold text-sm">
                      ✗ {submitError}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your name <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your full name"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                            errors.name && touched.name ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.name && touched.name && (
                        <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email address <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="your@email.com"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                            errors.email && touched.email ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.email && touched.email && (
                        <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone / WhatsApp <span className="text-red-600">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="+1 (555) 000-0000"
                          className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition ${
                            errors.phone && touched.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.phone && touched.phone && (
                        <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project type
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none bg-white"
                        >
                          <option value="">Select project type</option>
                          {PROJECT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={4}
                        placeholder="Tell us about your project..."
                        className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition resize-none ${
                          errors.message && touched.message ? "border-red-500 bg-red-50" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.message && touched.message && (
                      <p className="text-red-600 text-xs mt-1.5 font-medium">{errors.message}</p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    This site is protected by reCAPTCHA and the Google{" "}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
                      Terms of Service
                    </a>{" "}
                    apply.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Request a Consultation"}
                  </button>
                </form>
              </div>

              <div className="lg:border-l lg:border-gray-200 lg:pl-10">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Prefer to speak directly?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  You can also reach us via WhatsApp, email or phone. We&apos;re
                  happy to discuss your project.
                </p>
                <div className="space-y-4">
                  <a
                    href={`tel:${WHATSAPP_NUMBER}`}
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-red-600" />
                    +971 50 307 9863
                  </a>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <FaWhatsapp className="w-4 h-4 text-green-600" />
                    Chat on WhatsApp
                  </a>
                  <a
                    href="mailto:gm@horecahost.com"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-red-600" />
                    gm@horecahost.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
