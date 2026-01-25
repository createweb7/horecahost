import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const brandId = parseInt(id, 10);

    if (isNaN(brandId)) {
      return NextResponse.json(
        { error: "Invalid brand ID" },
        { status: 400 }
      );
    }

    // Get distinct subcategories that have products from this brand
    const { data, error } = await supabase
      .from("products")
      .select("subcategory:subcategories(id, name_en, name_ar, slug, category_id, category:categories(*))")
      .eq("brand_id", brandId)
      .eq("active", true)
      .not("subcategory_id", "is", null);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch subcategories" },
        { status: 500 }
      );
    }

    // Extract unique subcategories with product counts
    const subcategoriesMap = new Map<number, { data: unknown; count: number }>();
    if (Array.isArray(data)) {
      data.forEach((product: unknown) => {
        const prod = product as { subcategory: unknown };
        const subcat = prod.subcategory as { id: number; name_en: string };
        
        // Handle both single object and array returns from Supabase
        if (subcat && typeof subcat === 'object' && 'id' in subcat) {
          if (!subcategoriesMap.has(subcat.id)) {
            subcategoriesMap.set(subcat.id, { data: subcat, count: 0 });
          }
          // Increment product count
          const entry = subcategoriesMap.get(subcat.id);
          if (entry) {
            entry.count += 1;
          }
        }
      });
    }

    const subcategories = Array.from(subcategoriesMap.values())
      .map((entry) => ({
        ...(entry.data as Record<string, unknown>),
        productCount: entry.count,
      }))
      .sort((a: unknown, b: unknown) => {
        const aSubcat = a as { name_en: string };
        const bSubcat = b as { name_en: string };
        return aSubcat.name_en.localeCompare(bSubcat.name_en);
      });

    return NextResponse.json({
      subcategories,
    });
  } catch (error) {
    console.error("Error fetching brand subcategories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
