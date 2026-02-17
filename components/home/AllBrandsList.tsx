'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Brand {
  id: number;
  name_en: string;
  slug: string;
  image_path: string | null;
  country_en: string | null;
}

export default function AllBrandsList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands?limit=1000');
        if (!response.ok) throw new Error('Failed to fetch brands');
        const { brands: fetchedBrands } = await response.json();
        // Sort brands alphabetically by name_en
        const sortedBrands = (fetchedBrands || []).sort((a: Brand, b: Brand) =>
          a.name_en.localeCompare(b.name_en)
        );
        setBrands(sortedBrands);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching brands');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) return <div className="py-12 text-center text-gray-500">Loading brands...</div>;

  if (error || brands.length === 0) return null;

  return (
    <section className="py-0 md:py-8 lg:py-16 pb-6 md:pb-12 lg:pb-16 bg-gray-50">
      <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="mb-4 md:mb-8 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
            Browse All Brands
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Discover premium equipment from over {brands.length} trusted global brands
          </p>
        </div>

        {/* Brands Grid - Responsive with 2 cols on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/${brand.slug}`}
              className="group p-3 sm:p-4 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {brand.name_en}
                </h3>
                {brand.country_en && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">
                    {brand.country_en}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Schema.org markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Browse All Brands',
              description: `Explore ${brands.length} brands available on HorecaHost`,
              url: 'https://www.horecahost.com',
              mainEntity: {
                '@type': 'ItemList',
                itemListElement: brands.map((brand, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Brand',
                    name: brand.name_en,
                    url: `https://www.horecahost.com/${brand.slug}`,
                  },
                })),
              },
            }),
          }}
        />
      </div>
    </section>
  );
}
