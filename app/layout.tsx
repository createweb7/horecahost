import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/header/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000"),
  title: {
    default: "HorecaHost - Premium Hospitality & Kitchen Equipment",
    template: "%s",
  },
  description: "Your trusted supplier of premium hospitality and commercial kitchen equipment. Browse brands, products, and get expert solutions for your F&B business.",
  keywords: [
    "horeca equipment",
    "commercial kitchen equipment",
    "hospitality supplier",
    "restaurant equipment",
    "catering supplies",
    "hotel equipment",
    "food service equipment",
  ],
  authors: [{ name: "HorecaHost" }],
  creator: "HorecaHost",
  icons: {
    icon: "/favicon.ico?v=3",
    shortcut: "/favicon.ico?v=3",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000",
    siteName: "HorecaHost",
    title: "HorecaHost - Premium Hospitality & Kitchen Equipment",
    description: "Your trusted supplier of premium hospitality and commercial kitchen equipment.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HorecaHost - Premium Hospitality Equipment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HorecaHost - Premium Hospitality & Kitchen Equipment",
    description: "Your trusted supplier of premium hospitality and commercial kitchen equipment.",
    creator: "@horecahost",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_ORIGIN || "http://localhost:3000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Supabase for faster data fetching */}
        <link rel="preconnect" href="https://your-supabase-instance.supabase.co" />
      </head>
      <body suppressHydrationWarning className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
