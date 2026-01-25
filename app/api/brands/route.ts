import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Brand } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const offset = (page - 1) * limit;

    const { data, count, error } = await supabase
      .from("brands")
      .select("*", { count: "exact" })
      .eq("active", true)
      .order("name_en", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch brands" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      brands: data as Brand[],
      total: count || 0,
      page,
      limit,
      pages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
