"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Brand } from "@/lib/types";

export default function BrandLogosSlider() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const data = await res.json();
          setBrands(data.brands || []);
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <div className="py-12 bg-gray-50"></div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
          Our Trusted Brands
        </h2>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={15}
          breakpoints={{
            320: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 6 },
          }}
          loop
          className="brand-logos-slider"
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand.id}>
              <Link
                href={`/${brand.slug}`}
                className="flex items-center justify-center p-3 h-24 hover:bg-white rounded-lg transition-colors"
              >
                {brand.image_path ? (
                  <Image
                    src={brand.image_path}
                    alt={brand.name_en}
                    width={100}
                    height={96}
                    className="h-full w-auto object-contain hover:scale-110 transition-transform"
                  />
                ) : (
                  <span className="text-center text-sm font-semibold text-gray-700">
                    {brand.name_en}
                  </span>
                )}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
