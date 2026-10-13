import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { sanitizeText } from "@/lib/html-utils";

type Entity = { id: number; slug: string; name_ar: string | null; name_en: string };
export type SaudiArabicDetail = { kind: string; name: string; slug: string; title?: string; description?: string };
const nameOf = (entity: Entity) => sanitizeText(entity.name_ar) || sanitizeText(entity.name_en);

// Match the Arabic content resolver's precedence, including brand/subcategory pages.
// Database failures must remain errors, rather than being cached as missing pages.
export const getSaudiArabicDetail = cache(async (slug: string): Promise<SaudiArabicDetail | null> => {
  for (const table of ["products", "brands", "categories", "subcategories"] as const) {
    const { data, error } = await supabase.from(table)
      .select("id, slug, name_ar, name_en").eq("slug", slug).eq("active", true).maybeSingle();
    if (error) throw new Error(`Unable to resolve Saudi Arabic ${table}`);
    if (!data) continue;
    const result: SaudiArabicDetail = { kind: table, name: nameOf(data), slug: data.slug };
    if (table === "products") {
      const { data: seo } = await supabase.from("product_metadata_locations")
        .select("meta_title, meta_description").eq("product_id", data.id)
        .eq("country_code", "SA").eq("language", "ar").maybeSingle();
      result.title = sanitizeText(seo?.meta_title) || undefined;
      result.description = sanitizeText(seo?.meta_description) || undefined;
    }
    return result;
  }

  const parts = slug.split("-");
  for (let i = 1; i < parts.length; i++) {
    const { data: brand, error: brandError } = await supabase.from("brands")
      .select("id, slug, name_ar, name_en").eq("slug", parts.slice(0, i).join("-")).eq("active", true).maybeSingle();
    if (brandError) throw new Error("Unable to resolve Saudi Arabic brand");
    if (!brand) continue;
    const { data: subcategory, error: subcategoryError } = await supabase.from("subcategories")
      .select("id, slug, name_ar, name_en").eq("slug", parts.slice(i).join("-")).eq("active", true).maybeSingle();
    if (subcategoryError) throw new Error("Unable to resolve Saudi Arabic subcategory");
    if (!subcategory) continue;
    const { data: products, error } = await supabase.from("products").select("id")
      .eq("brand_id", brand.id).eq("subcategory_id", subcategory.id).eq("active", true).limit(1);
    if (error) throw new Error("Unable to resolve Saudi Arabic brand products");
    if (products?.length) return { kind: "brand-subcategory", name: `${nameOf(brand)} — ${nameOf(subcategory)}`, slug };
  }
  return null;
});
