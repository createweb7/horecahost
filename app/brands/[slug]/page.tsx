import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import BrandDetailClient from './BrandDetailClient';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  // Fetch brand by slug
  const { data: brand } = await supabase
    .from('brands')
    .select('id, name_en, name_ar, slug')
    .eq('slug', slug)
    .single();

  if (!brand) {
    return {
      title: 'Brand Not Found',
      description: 'The brand you are looking for does not exist.',
    };
  }

  // Fetch metadata for this brand (default to AE and en)
  const { data: metadata } = await supabase
    .from('brand_metadata_locations')
    .select('*')
    .eq('brand_id', brand.id)
    .eq('country_code', 'AE')
    .eq('language', 'en')
    .single();

  const title = metadata?.meta_title || brand.name_en;
  const description = metadata?.meta_description || `${brand.name_en} - Premium Commercial Equipment`;
  const keywords = metadata?.meta_keywords || `${brand.name_en}, commercial equipment`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/brands/${slug}`,
    },
    alternates: {
      canonical: `/brands/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const { data: brands } = await supabase
    .from('brands')
    .select('slug')
    .limit(100);

  return (brands || []).map(brand => ({
    slug: brand.slug,
  }));
}

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = params;

  // Fetch brand data server-side to pass to client
  const { data: brand } = await supabase
    .from('brands')
    .select('id, name_en, name_ar, slug')
    .eq('slug', slug)
    .single();

  // Fetch metadata server-side to pass to client
  let metadata = null;
  if (brand) {
    // First try: fetch for AE, en
    const { data: metaData, error: error1 } = await supabase
      .from('brand_metadata_locations')
      .select('*')
      .eq('brand_id', brand.id)
      .eq('country_code', 'AE')
      .eq('language', 'en')
      .single();
    
    metadata = metaData;
    
    // If not found, try to fetch ANY metadata for this brand
    if (!metadata) {
      const { data: anyMetadata } = await supabase
        .from('brand_metadata_locations')
        .select('*')
        .eq('brand_id', brand.id)
        .limit(1)
        .single();
      
      metadata = anyMetadata;
      
      console.log(`⚠️ [Server] No metadata found for AE/en, using fallback:`, {
        brand_id: brand.id,
        fallback_found: !!metadata,
      });
    }
    
    // Debug logging
    console.log(`📊 [Server] Brand metadata for ${brand.name_en} (ID: ${brand.id}):`, {
      metadata_found: !!metadata,
      h1_tag: metadata?.h1_tag || 'NOT SET',
      h2_tag: metadata?.h2_tag || 'NOT SET',
      paragraph_text: metadata?.paragraph_text || 'NOT SET',
      meta_title: metadata?.meta_title || 'NOT SET',
      country_code: metadata?.country_code || 'N/A',
      language: metadata?.language || 'N/A',
    });
  }

  return <BrandDetailClient slug={slug} brand={brand} metadata={metadata} />;
}
