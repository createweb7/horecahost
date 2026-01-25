import Banner from "@/components/banner/Banner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HomeFeatures from "@/components/home/HomeFeatures";
import HomeAbout from "@/components/about/HomeAbout";
import BrandLogosSlider from "@/components/home/BrandLogosSlider";
import Footer from "@/components/global/Footer";
import React from "react";

function page() {
  return (
    <div dir="rtl">
      <Banner />
      <FeaturedProducts />
      <HomeFeatures />
      <HomeAbout />
      <BrandLogosSlider />
      <Footer />
    </div>
  );
}

export default page;
