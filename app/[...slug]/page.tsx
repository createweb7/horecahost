import { Metadata } from 'next';
import Script from 'next/script';
import SlugPageClient from './SlugPageClient';
import { supabase } from '@/lib/supabase';

// Revalidate static pages every 1 hour to pick up metadata changes
export const revalidate = 3600;

// Helper to sanitize metadata by removing HTML tags (including encoded HTML entities)
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

interface SlugPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const slugPath = Array.isArray(slug) ? slug.join('-') : slug;

    // Fetch the resolved content to determine metadata - query database directly
    // Try to find product first
    const { data: productData } = await supabase
      .from('products')
      .select('id, name_en, name_ar, slug, images, brand:brands(id, name_en, country_en), category:categories(name_en), subcategory:subcategories(name_en)')
      .eq('slug', slugPath)
      .single();

    let contentType = null;
    let content: any = null;

    if (productData) {
      contentType = 'product';
      content = productData;
    } else {
      // Try category
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id, name_en, name_ar, slug')
        .eq('slug', slugPath)
        .single();

      if (categoryData) {
        contentType = 'category';
        content = categoryData;
      } else {
        // Try subcategory
        const { data: subcategoryData } = await supabase
          .from('subcategories')
          .select('id, name_en, name_ar, slug, category:categories(name_en)')
          .eq('slug', slugPath)
          .single();

        if (subcategoryData) {
          contentType = 'subcategory';
          content = subcategoryData;
        } else {
          // Try brand
          const { data: brandData } = await supabase
            .from('brands')
            .select('id, name_en, name_ar, slug, country_en')
            .eq('slug', slugPath)
            .single();

          if (brandData) {
            contentType = 'brand';
            content = brandData;
          }
        }
      }
    }

    if (!contentType || !content) {
      return {
        title: 'Product Not Found | HorecaHost',
        description: 'The product you are looking for could not be found.',
      };
    }

    // Generate metadata based on content type
    let title = 'HorecaHost - Premium Hospitality & Kitchen Equipment';
    let description = 'Your trusted supplier of premium hospitality and commercial kitchen equipment.';
    let keywords = ['horeca equipment', 'commercial kitchen'];
    let ogImage = `/og-image.png`;
    let canonical = `https://www.horecahost.com`;

    if (contentType === 'product') {
      const product = content;
      
      // Try to fetch from product_metadata_locations table (custom SEO)
      let metaTitle = title;
      let metaDescription = description;
      let metaKeywords: string[] = [];
      
      try {
        const { data: metadata } = await supabase
          .from('product_metadata_locations')
          .select('meta_title, meta_description, meta_keywords')
          .eq('product_id', product.id)
          .eq('country_code', 'AE')
          .eq('language', 'en')
          .single();
        
        if (metadata) {
          if (metadata.meta_title) metaTitle = sanitize(metadata.meta_title);
          if (metadata.meta_description) metaDescription = sanitize(metadata.meta_description);
          if (metadata.meta_keywords) metaKeywords = sanitize(metadata.meta_keywords).split(',').map((k: string) => k.trim());
        }
      } catch (e) {
        // Fall back to default metadata if fetch fails
        console.log('Could not fetch product metadata, using defaults');
      }
      
      title = metaTitle;
      description = metaDescription;
      keywords = metaKeywords.length > 0 ? metaKeywords : [
        product.name_en || product.name_ar,
        product.category?.name_en,
        product.brand?.name_en,
        'horeca equipment',
        'commercial kitchen',
      ].filter(Boolean);
      
      if (product.images?.[0]?.filename) {
        ogImage = `/storage/v1/object/public/product-images/${product.id}/${product.images[0].filename}`;
      }
      canonical = `https://www.horecahost.com/${product.slug}`;
    } else if (contentType === 'category') {
      const category = content;
      title = `${category.name_en} | HorecaHost`;
      description = `Browse our collection of ${category.name_en} for premium hospitality and restaurant equipment solutions.`;
      keywords = [category.name_en, 'horeca equipment', 'commercial kitchen'];
      canonical = `https://www.horecahost.com/${slug.join('/')}`;
    } else if (contentType === 'subcategory') {
      const subcategory = content;
      title = `${subcategory.name_en} | HorecaHost`;
      description = `Explore ${subcategory.name_en} - premium equipment for hospitality professionals.`;
      keywords = [
        subcategory.name_en,
        subcategory.category?.name_en,
        'horeca equipment',
      ].filter(Boolean);
      canonical = `https://www.horecahost.com/${slug.join('/')}`;
    } else if (contentType === 'brand') {
      const brand = content;
      
      // Try to fetch from brand_metadata_locations table (custom SEO)
      let metaTitle = `${brand.name_en} - Equipment & Products | HorecaHost`;
      let metaDescription = `Explore ${brand.name_en} products from ${brand.country_en}. Premium hospitality and commercial kitchen equipment.`;
      let metaKeywords: string[] = [];
      
      try {
        const { data: metadata, error } = await supabase
          .from('brand_metadata_locations')
          .select('meta_title, meta_description, meta_keywords')
          .eq('brand_id', brand.id)
          .eq('country_code', 'AE')
          .eq('language', 'en')
          .single();
        
        if (metadata) {
          if (metadata.meta_title) metaTitle = sanitize(metadata.meta_title);
          if (metadata.meta_description) metaDescription = sanitize(metadata.meta_description);
          if (metadata.meta_keywords) metaKeywords = sanitize(metadata.meta_keywords).split(',').map((k: string) => k.trim());
        } else if (!error) {
          // Fallback: try fetching any metadata for this brand
          const { data: anyMetadata } = await supabase
            .from('brand_metadata_locations')
            .select('meta_title, meta_description, meta_keywords')
            .eq('brand_id', brand.id)
            .limit(1)
            .single();
          
          if (anyMetadata) {
            if (anyMetadata.meta_title) metaTitle = sanitize(anyMetadata.meta_title);
            if (anyMetadata.meta_description) metaDescription = sanitize(anyMetadata.meta_description);
            if (anyMetadata.meta_keywords) metaKeywords = sanitize(anyMetadata.meta_keywords).split(',').map((k: string) => k.trim());
          }
        }
      } catch (e) {
        // Use defaults if query fails
      }
      
      title = metaTitle;
      description = metaDescription;
      keywords = metaKeywords.length > 0 ? metaKeywords : [brand.name_en, brand.country_en, 'horeca equipment'].filter(Boolean);
      canonical = `https://www.horecahost.com/${slug.join('/')}`;
    }

    return {
      title,
      description,
      keywords,
      authors: [{ name: 'HorecaHost' }],
      creator: 'HorecaHost',
      robots: 'index, follow',
      openGraph: {
        title,
        description,
        url: canonical,
        type: 'website',
        siteName: 'HorecaHost',
        images: [
          {
            url: ogImage.startsWith('http') ? ogImage : `https://www.horecahost.com${ogImage}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: '@horecahost',
        images: [ogImage.startsWith('http') ? ogImage : `https://www.horecahost.com${ogImage}`],
      },
      alternates: {
        canonical,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'HorecaHost - Premium Hospitality & Kitchen Equipment',
      description: 'Your trusted supplier of premium hospitality and commercial kitchen equipment.',
    };
  }
}

export default async function SlugPage({ params }: SlugPageProps) {
  const resolvedParams = await params;
  
  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />
      <SlugPageClient params={Promise.resolve(resolvedParams)} />
    </>
  );
}
