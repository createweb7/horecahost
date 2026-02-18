import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error) throw error;

    return NextResponse.json({ brand: data });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name_en, name_ar, slug, country_en, country_ar, active } = body;

    const { data, error } = await supabase
      .from("brands")
      .update({
        name_en,
        name_ar,
        slug,
        country_en,
        country_ar,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id))
      .select();

    if (error) throw error;

    return NextResponse.json({
      brand: data?.[0],
      message: "Brand updated successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const brandId = parseInt(id);

    // First check if brand exists
    const { data: brand, error: fetchError } = await supabase
      .from("brands")
      .select("id, name_en")
      .eq("id", brandId)
      .single();

    if (fetchError || !brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Check for products linked to this brand
    const { data: products } = await supabase
      .from("products")
      .select("id")
      .eq("brand_id", brandId)
      .limit(1);

    if (products && products.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete brand "${brand.name_en}". It has ${products.length} product(s) linked to it. Delete or reassign products first.`,
        },
        { status: 400 },
      );
    }

    // Delete the brand
    const { error } = await supabase.from("brands").delete().eq("id", brandId);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to delete brand" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: `Brand "${brand.name_en}" deleted successfully`,
    });
  } catch (error: unknown) {
    console.error("Delete endpoint error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
