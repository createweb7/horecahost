import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Subcategory } from "@/lib/types";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("active", true)
      .order("name_en", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch subcategories" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subcategories: data as Subcategory[],
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
