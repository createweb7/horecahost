import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Category } from "@/lib/types";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("name_en", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      categories: data as Category[],
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
