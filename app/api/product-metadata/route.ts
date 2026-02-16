import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper to sanitize metadata by removing HTML tags (including encoded HTML entities)
const sanitizeMetadata = (metadata: any): any => {
  if (!metadata) return null;
  
  const sanitize = (text: string | null | undefined): string => {
    if (!text) return '';
    let decoded = String(text)
      // Decode HTML entities first
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    // Then remove HTML tags
    return decoded.replace(/<[^>]*>/g, '').trim();
  };
  
  return {
    ...metadata,
    meta_title: sanitize(metadata.meta_title),
    meta_description: sanitize(metadata.meta_description),
    meta_keywords: sanitize(metadata.meta_keywords),
  };
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');
    const country = searchParams.get('country') || 'AE';
    const language = searchParams.get('language') || 'en';

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    // Fetch metadata from product_metadata_locations table
    const { data, error } = await supabase
      .from('product_metadata_locations')
      .select('meta_title, meta_description, meta_keywords')
      .eq('product_id', parseInt(productId))
      .eq('country_code', country.toUpperCase())
      .eq('language', language)
      .single();

    if (error) {
      console.log('Metadata not found:', error);
      return NextResponse.json(
        { error: 'Metadata not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sanitizeMetadata(data), {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching product metadata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
