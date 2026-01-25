import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ProductWithRelations } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const brand = searchParams.get("brand");
    const subcategory = searchParams.get("subcategory");

    const offset = (page - 1) * limit;

    let query = supabase
      .from("products")
      .select(
        `
        *,
        brand:brands(*),
        category:categories(*),
        subcategory:subcategories(*)
      `,
        { count: "exact" }
      )
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category_id", parseInt(category));
    }

    if (brand) {
      query = query.eq("brand_id", parseInt(brand));
    }

    if (subcategory) {
      query = query.eq("subcategory_id", parseInt(subcategory));
    }

    if (search) {
      query = query.or(
        `name_en.ilike.%${search}%,name_ar.ilike.%${search}%,model.ilike.%${search}%`
      );
    }

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: data as ProductWithRelations[],
      total: count,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
