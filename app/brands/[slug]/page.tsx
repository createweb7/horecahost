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

export default function BrandDetailPage({ params }: Props) {
  return <BrandDetailClient slug={params.slug} />;
}
