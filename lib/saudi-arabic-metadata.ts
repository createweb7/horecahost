import type { Metadata } from "next";

export function saudiArabicMetadata(path: string, title: string, description: string): Metadata {
  const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";
  const url = `${origin}/sa/ar/${path}`;
  return {
    title: `${title} | هوريكا هوست`, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, locale: "ar_SA", siteName: "HorecaHost", type: "website" },
    twitter: { title, description, card: "summary_large_image" },
  };
}
