import Link from "next/link";
import Image from "next/image";
import SaudiArabicPage from "@/components/country/SaudiArabicPage";
import { saudiArabicMetadata } from "@/lib/saudi-arabic-metadata";
import { supabase } from "@/lib/supabase";
import type { Brand } from "@/lib/types";

export const revalidate = 3600;
const title = "العلامات التجارية لمعدات الضيافة في السعودية";
const description = "استكشف العلامات التجارية لمعدات المطاعم والفنادق والمقاهي وتواصل معنا للتحقق من التوافر والتوريد إلى السعودية.";
const origin = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";
export const metadata = {
  ...saudiArabicMetadata("brands", title, description),
  alternates: { canonical: `${origin}/sa/ar/brands`, languages: {
    "en-AE": `${origin}/brands`, "en-SA": `${origin}/sa/brands`, "ar-SA": `${origin}/sa/ar/brands`,
    "en-MV": `${origin}/mv/brands`, "en-MU": `${origin}/mu/brands`, "x-default": `${origin}/brands`,
  } },
};

export default async function BrandsPage() {
  const { data, error } = await supabase.from("brands").select("*").eq("active", true).order("name_en");
  const brands = (data || []) as Brand[];
  return <SaudiArabicPage title={title} description={description}>
    {error ? <p role="alert">تعذر تحميل العلامات التجارية. يرجى المحاولة مرة أخرى أو <Link href="/sa/ar/contact" className="text-red-700 underline">التواصل معنا</Link>.</p> : brands.length ?
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {brands.map(brand => <Link key={brand.id} href={`/sa/ar/${brand.slug}`} className="rounded-2xl border border-gray-200 p-6 hover:border-red-500 hover:shadow-md transition">
          {brand.image_path && <div className="relative h-32 mb-5"><Image src={brand.image_path} alt={brand.name_ar || brand.name_en} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain" /></div>}
          <h2 className="font-semibold text-lg text-center">{brand.name_ar || brand.name_en}</h2>
        </Link>)}
      </div> : <p>لا توجد علامات تجارية متاحة حالياً.</p>}
  </SaudiArabicPage>;
}
