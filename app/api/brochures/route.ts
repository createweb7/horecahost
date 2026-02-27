import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: "product_id is required" },
        { status: 400 },
      );
    }

    // Fetch all active brochures for the product
    const { data, error } = await supabase
      .from("brochures")
      .select("*")
      .eq("product_id", product_id)
      .eq("active", true)
      .order("is_main", { ascending: false })
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching brochures:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: "Failed to fetch brochures",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      );
    }

    // Build full URLs for brochure files - use external_url if available, fallback to local
    const brochures = data.map((brochure) => ({
      id: brochure.id,
      product_id: brochure.product_id,
      filename: brochure.filename,
      file_path: brochure.file_path,
      // Use external_url if available (from shared hosting), otherwise fallback to local
      url: brochure.external_url || `/brochure/${brochure.filename}`,
      external_url: brochure.external_url,
      is_main: brochure.is_main,
      active: brochure.active,
      created_at: brochure.created_at,
    }));

    return NextResponse.json({
      success: true,
      count: brochures.length,
      brochures,
    });
  } catch (error) {
    console.error("Error in brochures API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
