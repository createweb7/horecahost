'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/global/Footer';

interface Brand {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface BrandMetadata {
  id?: number;
  h1_tag?: string | null;
  h2_tag?: string | null;
  paragraph_text?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  [key: string]: any;
}

interface BrandDetailClientProps {
  slug: string;
  brand: Brand | null;
  metadata: BrandMetadata | null;
}

export default function BrandDetailClient({ slug, brand, metadata }: BrandDetailClientProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      if (!brand) return;
      
      try {
        // Fetch subcategories for this brand
        const subcatRes = await fetch(`/api/brands/${brand.id}/subcategories`);
        if (subcatRes.ok) {
          const subData = await subcatRes.json();
          setSubcategories(subData);
        }
      } catch (error) {
        console.error('Error fetching brand subcategories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [brand]);

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Brand Not Found</h1>
          <Link href="/brands" className="text-blue-600 hover:underline">
            Back to Brands
          </Link>
        </div>
      </div>
    );
  }

  // Use metadata values with proper fallbacks
  // Priority: h1_tag → meta_title → brand name
  // For H2: h2_tag → meta_description (truncated for H2)
  const h1Text = metadata?.h1_tag || metadata?.meta_title || brand.name_en;
  const h2Text = metadata?.h2_tag || metadata?.meta_description || `Premium ${brand.name_en} Equipment`;
  const paragraphText = metadata?.paragraph_text || '';

  console.log('🎯 Brand Detail Page Data:', {
    slug,
    brand: brand.name_en,
    metadata_exists: !!metadata,
    h1_tag: metadata?.h1_tag || 'NOT SET',
    h2_tag: metadata?.h2_tag || 'NOT SET',
    paragraph_text: metadata?.paragraph_text || 'NOT SET',
    meta_title: metadata?.meta_title || 'NOT SET',
    meta_description: metadata?.meta_description || 'NOT SET',
    final_h1: h1Text,
    final_h2: h2Text,
  });

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-100 border-t-4 border-gray-300 py-4">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            {' › '}
            <Link href="/brands" className="hover:text-gray-900">
              Brands
            </Link>
            {' › '}
            <span className="text-gray-900 font-semibold">{brand.name_en}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {h1Text}
            </h1>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
            </div>
            {h2Text && (
              <h2 className="text-lg text-gray-600 mb-4">
                {h2Text}
              </h2>
            )}
            {paragraphText && (
              <p className="text-lg text-gray-600">
                {paragraphText}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl xl:max-w-7xl px-8 py-16">
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About {brand.name_en}</h2>
            <div className="space-y-4 text-gray-600 text-lg">
              <p>
                Explore our comprehensive range of {brand.name_en} products and solutions.
              </p>
              <p>
                {brand.name_en} is a trusted name in commercial hospitality equipment,
                delivering reliable and innovative solutions for hotels, restaurants,
                and catering businesses worldwide.
              </p>
            </div>
          </section>

          {/* Popular Products by Type */}
          {subcategories.length > 0 && (
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Popular Products by Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subcategories.map((subcat) => (
                  <Link
                    key={subcat.id}
                    href={`/${subcat.slug}`}
                    className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="text-center">
                      <div className="h-24 flex items-center justify-center mb-4">
                        <img 
                          src={`/images/subcategories/${subcat.slug}.png`} 
                          alt={subcat.name_en}
                          className="max-h-24 max-w-full object-contain"
                          onError={(e) => {
                            // Fallback: hide image if not found
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{subcat.name_en}</h3>
                      <p className="text-sm text-gray-600">{subcat.product_count || '0'} products</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="bg-red-600 rounded-lg p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Interested in {brand.name_en} Products?</h2>
            <p className="text-lg mb-8 text-red-50">
              Contact our team to learn more about {brand.name_en} equipment and solutions.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get In Touch
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
