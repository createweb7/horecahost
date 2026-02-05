"use client";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Autoplay, Pagination } from "swiper/modules";
import "./banner.css";

export default function Banner() {
  const pathname = usePathname();
  const isArabic = pathname.startsWith("/ar");
  const slides = [
    {
      id: 1,
      image: "/banners/img9.webp",
      title: "Premium Kitchen & Horeca Solutions",
      brand: { name: "Hamilton Beach", country: "United States" },
      subtitle: "High-performance equipment designed for professionals.",
      buttonText: "Explore Products",
      buttonLink: "/products",
    },
    {
      id: 2,
      image: "/banners/img6.webp",
      title: "Quality You Can Trust",
      brand: { name: "Fagor", country: "Spain" },
      subtitle: "Reliable commercial appliances built for durability.",
      buttonText: "View Categories",
      buttonLink: "/products",
    },
    {
      id: 3,
      image: "/banners/img8.webp",
      title: "Innovative Horeca Technology",
      brand: { name: "Robot Coupe", country: "France" },
      subtitle: "Modern designs to enhance your commercial workflow.",
      buttonText: "Contact Us",
      buttonLink: "/contact",
    },
    {
      id: 4,
      image: "/banners/img10.webp",
      title: "Premium Equipment Excellence",
      brand: { name: "Santos", country: "France" },
      subtitle: "Crafted for the most demanding culinary professionals.",
      buttonText: "Shop Now",
      buttonLink: "/products",
    },
    {
      id: 5,
      image: "/banners/img11.webp",
      title: "Perfect Solutions for Every Chef",
      brand: { name: "Fagor", country: "Spain" },
      subtitle: "Professional-grade equipment for demanding kitchens.",
      buttonText: "Discover More",
      buttonLink: "/products",
    },
  ];

  return (
    <div className="w-full h-[400px] lg:h-[660px] relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        direction="vertical"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[400px] lg:h-[660px]">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover"
              />

              <div className={`absolute inset-0 ${
                isArabic
                  ? "bg-linear-to-r from-black/70 to-black/10"
                  : "bg-linear-to-r from-black/70 to-black/10"
              }`}></div>

              <div
                className={`absolute inset-y-0 flex flex-col justify-center text-white max-w-[650px] left-0 px-6 lg:pl-24 text-left`}
              >
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4`}>
                  {slide.title}
                </h1>

                {slide.brand && (
                  <div className="mb-4">
                    <p className="text-base md:text-lg font-semibold">{slide.brand.name}</p>
                    <p className="text-sm opacity-90">Made in: {slide.brand.country}</p>
                  </div>
                )}

                <p className="text-base md:text-lg lg:text-xl opacity-90 mb-6">{slide.subtitle}</p>

                <div className="flex justify-start">
                  <Link
                    href={slide.buttonLink}
                    className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-md text-white font-medium w-fit"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
