'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Footer from '@/components/global/Footer';

interface Brand {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
}

interface BrandMetadata {
  id: number;
  h1_tag: string;
  h2_tag: string;
  paragraph_text: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

export default function BrandDetailClient({ slug }: { slug: string }) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [metadata, setMetadata] = useState<BrandMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch brand
      const { data: brandData } = await supabase
        .from('brands')
        .select('id, name_en, name_ar, slug')
        .eq('slug', slug)
        .single();

      if (brandData) {
        setBrand(brandData);

        // Fetch metadata for this brand (AE, en)
        const { data: metaData } = await supabase
          .from('brand_metadata_locations')
          .select('*')
          .eq('brand_id', brandData.id)
          .eq('country_code', 'AE')
          .eq('language', 'en')
          .single();

        if (metaData) {
          setMetadata(metaData);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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

  // Use metadata values or defaults
  const h1Text = metadata?.h1_tag || brand.name_en;
  const h2Text = metadata?.h2_tag || '';
  const paragraphText = metadata?.paragraph_text || '';

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
