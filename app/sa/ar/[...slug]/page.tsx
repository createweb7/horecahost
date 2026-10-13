import { marketDetailAlternates } from "@/lib/market-alternates";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArabicDetailPage from "@/app/ar/[...slug]/page";
import { getSaudiArabicDetail } from "@/lib/saudi-arabic-detail";

type Props = { params: Promise<{ slug: string[] }> };
const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

async function resolve(params: Props["params"]) {
  const { slug } = await params;
  // Catalogue slugs are flat. Do not publish aliases for arbitrary nested paths.
  if (slug.length !== 1) notFound();
  const detail = await getSaudiArabicDetail(slug[0]);
  if (!detail) notFound();
  return detail;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const detail = await resolve(params);
  const path = encodeURIComponent(detail.slug);
  const title = detail.title || `${detail.name} في السعودية | هوريكا هوست`;
  const description = detail.description || `استكشف ${detail.name} لمشاريع المطاعم والفنادق والمقاهي في السعودية. تواصل مع هوريكا هوست لمعرفة المواصفات والتوافر وطلب عرض سعر.`;
  const canonical = `${origin}/sa/ar/${path}`;
  return {
    title,
    description,
    alternates: {
      canonical,
      // Saudi English supports individual entities, but not brand/subcategory combinations.
      ...(detail.kind !== "brand-subcategory" ? { languages: marketDetailAlternates(origin, detail.slug) } : {}),
    },
    openGraph: { title, description, url: canonical, locale: "ar_SA", siteName: "HorecaHost", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SaudiArabicDetailPage({ params }: Props) {
  await resolve(params);
  return <div lang="ar" dir="rtl"><ArabicDetailPage params={params} /></div>;
}
