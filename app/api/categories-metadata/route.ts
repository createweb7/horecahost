import { supabase } from "@/lib/supabase";

// Helper to sanitize metadata by removing HTML tags and decoding HTML entities
const sanitizeMetadata = (metadata: any): any => {
  if (!metadata) return null;

  const sanitize = (text: string | null | undefined): string => {
    if (!text) return "";
    let decoded = String(text)
      // Decode HTML entities first
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    // Then remove HTML tags
    return decoded.replace(/<[^>]*>/g, "").trim();
  };

  return {
    ...metadata,
    h1_tag: sanitize(metadata.h1_tag),
    h2_tag: sanitize(metadata.h2_tag),
    paragraph_text: sanitize(metadata.paragraph_text),
    meta_title: sanitize(metadata.meta_title),
    meta_description: sanitize(metadata.meta_description),
    meta_keywords: sanitize(metadata.meta_keywords),
  };
};

export async function POST(request: Request) {
  try {
    const {
      category_id,
      country_code = "AE",
      language = "en",
    } = await request.json();

    if (!category_id) {
      return Response.json(
        { error: "category_id is required" },
        { status: 400 },
      );
    }

    // First try to fetch metadata for specified country/language
    const { data: metadata, error } = await supabase
      .from("category_metadata_locations")
      .select("*")
      .eq("category_id", category_id)
      .eq("country_code", country_code)
      .eq("language", language)
      .single();

    if (metadata) {
      console.log(
        "📤 Raw category metadata from DB:",
        JSON.stringify(metadata, null, 2),
      );
      const sanitized = sanitizeMetadata(metadata);
      console.log(
        "✅ Sanitized category metadata:",
        JSON.stringify(sanitized, null, 2),
      );
      return Response.json(sanitized);
    }

    // Fallback: fetch any metadata for this category
    const { data: anyMetadata } = await supabase
      .from("category_metadata_locations")
      .select("*")
      .eq("category_id", category_id)
      .limit(1)
      .single();

    if (anyMetadata) {
      console.log(
        "📤 Fallback category metadata from DB:",
        JSON.stringify(anyMetadata, null, 2),
      );
      const sanitized = sanitizeMetadata(anyMetadata);
      console.log(
        "✅ Sanitized fallback category metadata:",
        JSON.stringify(sanitized, null, 2),
      );
      return Response.json(sanitized);
    }

    // No metadata found
    return Response.json(null);
  } catch (error) {
    console.error("Error fetching category metadata:", error);
    return Response.json(
      { error: "Failed to fetch metadata" },
      { status: 500 },
    );
  }
}
