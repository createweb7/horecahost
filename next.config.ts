import type { NextConfig } from "next";

// 24 recently-added products were given slugs without the brand-name prefix the rest
// of the catalog uses (e.g. "rht-420" instead of "staf59-rht-420"). Renamed in the DB
// on 2026-09-17; these redirects preserve any existing links/rankings to the old URLs.
const RENAMED_PRODUCT_SLUGS: [string, string][] = [
  ["fix-head-spiral-kneading-machine", "igf-fornitalia-fix-head-spiral-kneading-machine"],
  ["liftable-head-spiral-kneading-machine", "igf-fornitalia-liftable-head-spiral-kneading-machine"],
  ["2500-fix-head-spiral-kneading-machine", "igf-fornitalia-2500-fix-head-spiral-kneading-machine"],
  ["2200-top-fix-head-spiral-kneading-machine", "igf-fornitalia-2200-top-fix-head-spiral-kneading-machine"],
  ["3100-minima-fix-head-spiral-kneading-machine", "igf-fornitalia-3100-minima-fix-head-spiral-kneading-machine"],
  ["2800-fork-kneading-machine", "igf-fornitalia-2800-fork-kneading-machine"],
  ["2700-multifunctional-mixer-with-liftable-head", "igf-fornitalia-2700-multifunctional-mixer-with-liftable-head"],
  ["2900-pl07-planetary-mixer-capacity-7-liters", "igf-fornitalia-2900-pl07-planetary-mixer-capacity-7-liters"],
  ["2900-pl10-planetary-mixer-capacity-10-liters", "igf-fornitalia-2900-pl10-planetary-mixer-capacity-10-liters"],
  ["2300-m30-m40-stainless-steel-pizza-roller", "igf-fornitalia-2300-m30-m40-stainless-steel-pizza-roller"],
  ["2300-l30-40-stainless-steel-pizza-roller", "igf-fornitalia-2300-l30-40-stainless-steel-pizza-roller"],
  ["2300-l40p-stainless-steel-pizza-roller", "igf-fornitalia-2300-l40p-stainless-steel-pizza-roller"],
  ["2300-l50p-stainless-steel-pizza-roller", "igf-fornitalia-2300-l50p-stainless-steel-pizza-roller"],
  ["manual-meat-tenderizer", "tekna-pro-manual-meat-tenderizer"],
  ["automatic-motorized-meat-tenderizer", "tekna-pro-automatic-motorized-meat-tenderizer"],
  ["bfe-150", "staf59-bfe-150"],
  ["bfe-400", "staf59-bfe-400"],
  ["gls2", "staf59-gls2"],
  ["hse-300", "staf59-hse-300"],
  ["hse-400", "staf59-hse-400"],
  ["rhb-15100", "staf59-rhb-15100"],
  ["rhs-1540", "staf59-rhs-1540"],
  ["rhs-1560", "staf59-rhs-1560"],
  ["rht-420", "staf59-rht-420"],
];

const RENAMED_PRODUCT_REDIRECTS = RENAMED_PRODUCT_SLUGS.flatMap(([oldSlug, newSlug]) =>
  ["", "/ar", "/sa", "/mu", "/mv"].map((prefix) => ({
    source: `${prefix}/${oldSlug}`,
    destination: `${prefix}/${newSlug}`,
    permanent: true,
  })),
);

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disable Next.js image optimization to avoid Vercel free tier quota limits
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
      ...RENAMED_PRODUCT_REDIRECTS,
    ];
  },
};

export default nextConfig;
