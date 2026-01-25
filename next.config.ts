import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uzwydvsprvwejpgfsejp.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    scrollRestoration: false,
  },
  async redirects() {
    return [
      // Redirect old product URLs from /products/category/slug to /slug
      {
        source: "/products/:category/:slug",
        destination: "/:slug",
        permanent: true, // 301 redirect - preserves SEO value
      },
      // Redirect old category URLs from /products/category to /category
      {
        source: "/products/:category",
        destination: "/:category",
        permanent: true, // 301 redirect
      },
      // Redirect old /products page
      {
        source: "/products",
        destination: "/products",
        permanent: true,
      },
      // Same redirects for Arabic URLs
      {
        source: "/ar/products/:category/:slug",
        destination: "/ar/:slug",
        permanent: true,
      },
      {
        source: "/ar/products/:category",
        destination: "/ar/:category",
        permanent: true,
      },
      {
        source: "/ar/products",
        destination: "/ar/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
