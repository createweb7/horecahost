import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Check if the columns exist by trying to query them
    const { data, error } = await supabase
      .from('brand_metadata_locations')
      .select('id, brand_id, h1_tag, h2_tag, paragraph_text, meta_title')
      .limit(1);

    if (error) {
      return Response.json({
        error: 'Query error',
        details: error.message,
        code: error.code,
      }, { status: 500 });
    }

    return Response.json({
      success: true,
      columns_found: true,
      sample_row: data && data.length > 0 ? data[0] : null,
      message: data && data.length > 0 ? 'Columns exist and data found' : 'Columns exist but no data',
    });
  } catch (err: any) {
    return Response.json({
      error: 'Unexpected error',
      message: err.message,
    }, { status: 500 });
  }
}
