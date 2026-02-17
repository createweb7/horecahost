import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') || 'hamilton-beach';

  try {
    // Get brand
    const { data: brand } = await supabase
      .from('brands')
      .select('id, name_en, slug')
      .eq('slug', slug)
      .single();

    if (!brand) {
      return Response.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Get metadata
    const { data: metadata } = await supabase
      .from('brand_metadata_locations')
      .select('*')
      .eq('brand_id', brand.id)
      .single();

    return Response.json({
      brand,
      metadata: metadata || null,
      fields_analysis: metadata ? {
        h1_tag: {
          value: metadata.h1_tag,
          contains_html: /<|&lt;/.test(String(metadata.h1_tag || '')),
          length: String(metadata.h1_tag || '').length,
        },
        h2_tag: {
          value: metadata.h2_tag,
          contains_html: /<|&lt;/.test(String(metadata.h2_tag || '')),
          length: String(metadata.h2_tag || '').length,
        },
        meta_title: {
          value: metadata.meta_title,
          contains_html: /<|&lt;/.test(String(metadata.meta_title || '')),
          length: String(metadata.meta_title || '').length,
        },
        meta_description: {
          value: metadata.meta_description,
          contains_html: /<|&lt;/.test(String(metadata.meta_description || '')),
          length: String(metadata.meta_description || '').length,
        },
        paragraph_text: {
          length: String(metadata.paragraph_text || '').length,
          contains_html: /<|&lt;/.test(String(metadata.paragraph_text || '')),
          first_200_chars: String(metadata.paragraph_text || '').substring(0, 200),
        },
      } : null,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
