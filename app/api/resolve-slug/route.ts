import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter required" },
        { status: 400 }
      );
    }

    const parts = slug.split("-");

    // Try to resolve as product (brand-subcategory-model format)
    const productResult = await supabase
      .from("products")
      .select(
        `
        *,
        brand:brands(*),
        category:categories(*),
        subcategory:subcategories(*)
      `
      )
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (productResult.data && !productResult.error) {
      return NextResponse.json({
        type: "product",
        data: productResult.data,
      });
    }

    // Try to resolve as brand
    const brandResult = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (brandResult.data && !brandResult.error) {
      return NextResponse.json({
        type: "brand",
        data: brandResult.data,
      });
    }

    // Try to resolve as category
    const categoryResult = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (categoryResult.data && !categoryResult.error) {
      return NextResponse.json({
        type: "category",
        data: categoryResult.data,
      });
    }

    // Try to resolve as subcategory
    const subcategoryResult = await supabase
      .from("subcategories")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (subcategoryResult.data && !subcategoryResult.error) {
      return NextResponse.json({
        type: "subcategory",
        data: subcategoryResult.data,
      });
    }

    // Try to resolve as brand+subcategory (brand-slug-subcategory-slug format)
    if (parts.length >= 2) {
      // Try different split patterns to find brand and subcategory
      for (let i = 1; i < parts.length; i++) {
        const possibleBrandSlug = parts.slice(0, i).join("-");
        const possibleSubcatSlug = parts.slice(i).join("-");

        const brandResult = await supabase
          .from("brands")
          .select("id, slug, name_en, name_ar, country_en, country_ar, active")
          .eq("slug", possibleBrandSlug)
          .eq("active", true)
          .single();

        if (brandResult.data && !brandResult.error) {
          const subcatResult = await supabase
            .from("subcategories")
            .select("*, category:categories(*)")
            .eq("slug", possibleSubcatSlug)
            .eq("active", true)
            .single();

          if (subcatResult.data && !subcatResult.error) {
            // Fetch products for this brand+subcategory combination
            const productsResult = await supabase
              .from("products")
              .select(
                `
                *,
                brand:brands(*),
                category:categories(*),
                subcategory:subcategories(*)
              `
              )
              .eq("brand_id", brandResult.data.id)
              .eq("subcategory_id", subcatResult.data.id)
              .eq("active", true);

            if (productsResult.data && productsResult.data.length > 0) {
              return NextResponse.json({
                type: "brand-subcategory",
                brand: brandResult.data,
                subcategory: subcatResult.data,
                products: productsResult.data,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ error: "Slug not found" }, { status: 404 });
  } catch (error) {
    console.error("Error resolving slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
