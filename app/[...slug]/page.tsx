import { Metadata } from 'next';
import Script from 'next/script';
import SlugPageClient from './SlugPageClient';

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:3000';

interface SlugPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const slugPath = Array.isArray(slug) ? slug.join('-') : slug;

    // Fetch the resolved content to determine metadata
    const res = await fetch(`${SITE_ORIGIN}/api/resolve-slug?slug=${slugPath}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });

    if (!res.ok) {
      return {
        title: 'Product Not Found | HorecaHost',
        description: 'The product you are looking for could not be found.',
      };
    }

    const content = await res.json();
    const contentType = content.type;
    const contentData = content.data;

    // Generate metadata based on content type
    let title = 'HorecaHost - Premium Hospitality & Kitchen Equipment';
    let description = 'Your trusted supplier of premium hospitality and commercial kitchen equipment.';
    let keywords = ['horeca equipment', 'commercial kitchen'];
    let ogImage = `${SITE_ORIGIN}/og-image.png`;
    let canonical = SITE_ORIGIN;

    if (contentType === 'product' && contentData) {
      const product = contentData;
      
      // Try to fetch from product_metadata_locations table (generated SEO)
      let metaTitle = title;
      let metaDescription = description;
      let metaKeywords: string[] = [];
      
      try {
        const metaRes = await fetch(
          `${SITE_ORIGIN}/api/product-metadata?productId=${product.id}&country=AE&language=en`,
          { next: { revalidate: 3600 } }
        );
        
        if (metaRes.ok) {
          const metadata = await metaRes.json();
          if (metadata.meta_title) metaTitle = metadata.meta_title;
          if (metadata.meta_description) metaDescription = metadata.meta_description;
          if (metadata.meta_keywords) metaKeywords = metadata.meta_keywords.split(',').map((k: string) => k.trim());
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
        ogImage = `${SITE_ORIGIN}/storage/v1/object/public/product-images/${product.id}/${product.images[0].filename}`;
      }
      canonical = `${SITE_ORIGIN}/products/${product.slug}`;
    } else if (contentType === 'category' && contentData) {
      const category = contentData;
      title = `${category.name_en} | HorecaHost`;
      description = `Browse our collection of ${category.name_en} for premium hospitality and restaurant equipment solutions.`;
      keywords = [category.name_en, 'horeca equipment', 'commercial kitchen'];
      canonical = `${SITE_ORIGIN}/${slug.join('/')}`;
    } else if (contentType === 'subcategory' && contentData) {
      const subcategory = contentData;
      title = `${subcategory.name_en} | HorecaHost`;
      description = `Explore ${subcategory.name_en} - premium equipment for hospitality professionals.`;
      keywords = [
        subcategory.name_en,
        subcategory.category?.name_en,
        'horeca equipment',
      ].filter(Boolean);
      canonical = `${SITE_ORIGIN}/${slug.join('/')}`;
    } else if (contentType === 'brand' && contentData) {
      const brand = contentData;
      title = `${brand.name_en} - Equipment & Products | HorecaHost`;
      description = `Explore ${brand.name_en} products from ${brand.country_en}. Premium hospitality and commercial kitchen equipment.`;
      keywords = [brand.name_en, brand.country_en, 'horeca equipment'];
      canonical = `${SITE_ORIGIN}/${slug.join('/')}`;
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
            url: ogImage,
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
        images: [ogImage],
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
