import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { brand_id, country_code = 'AE', language = 'en' } = await request.json();

    if (!brand_id) {
      return Response.json({ error: 'brand_id is required' }, { status: 400 });
    }

    // First try to fetch metadata for specified country/language
    const { data: metadata, error } = await supabase
      .from('brand_metadata_locations')
      .select('*')
      .eq('brand_id', brand_id)
      .eq('country_code', country_code)
      .eq('language', language)
      .single();

    if (metadata) {
      return Response.json(metadata);
    }

    // Fallback: fetch any metadata for this brand
    const { data: anyMetadata } = await supabase
      .from('brand_metadata_locations')
      .select('*')
      .eq('brand_id', brand_id)
      .limit(1)
      .single();

    if (anyMetadata) {
      return Response.json(anyMetadata);
    }

    // No metadata found
    return Response.json(null);
  } catch (error) {
    console.error('Error fetching brand metadata:', error);
    return Response.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
