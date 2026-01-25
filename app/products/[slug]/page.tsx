import ProductDetailClient from "@/components/products/ProductDetailClient";

import type { Metadata } from "next";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.SITE_ORIGIN || "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await fetch(`${SITE_ORIGIN}/api/products/${slug}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });
    if (!res.ok) return { title: "Product" };
    const product = await res.json();

    const title = product.name_en || product.name || "Product";
    const description = (product.description_en || product.description || "").slice(0, 160);
    const imageUrl = product.images && product.images.length > 0 
      ? (product.images[0].filename 
          ? `${SITE_ORIGIN}/storage/v1/object/public/product-images/${product.id}/${product.images[0].filename}` 
          : product.image_path || `${SITE_ORIGIN}/placeholder.png`)
      : `${SITE_ORIGIN}/placeholder.png`;

    return {
      title: `${title} | HorecaHost`,
      description,
      keywords: [
        product.name_en,
        product.category?.name_en || "equipment",
        product.brand?.name_en || "brand",
        "horeca equipment",
        "commercial kitchen",
      ].filter(Boolean),
      openGraph: {
        type: "website",
        title: `${title} | HorecaHost`,
        description,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: title,
          },
        ],
        url: `${SITE_ORIGIN}/products/${product.slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | HorecaHost`,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${SITE_ORIGIN}/products/${product.slug}`,
      },
    };
  } catch (err) {
    console.error("Error generating product metadata:", err);
    return { title: "Product | HorecaHost" };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
  
  // Fetch product for JSON-LD
  let product = null;
  try {
    const res = await fetch(`${SITE_ORIGIN}/api/products/${slug}`, {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });
    if (res.ok) product = await res.json();
  } catch (err) {
    // ignore
  }

  const jsonLd = product
    ? {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name_en || product.name,
        description: product.description_en || product.description,
        sku: product.sku || product.model || undefined,
        brand: product.brand ? { "@type": "Brand", name: product.brand.name_en || product.brand.name } : undefined,
        image: (product.images || []).map((i: any) => i.filename ? `${SITE_ORIGIN}/storage/v1/object/public/product-images/${product.id}/${i.filename}` : i.url || i.path).filter(Boolean),
        offers: {
          "@type": "Offer",
          priceCurrency: product.currency || "USD",
          price: (product.discount_price || product.price) || undefined,
          availability: product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `${SITE_ORIGIN}/${product.slug}`,
        },
      }
    : null;

  return (
    <>
      {/* Google reCAPTCHA v3 Script - Only on product pages */}
      <script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        async
        defer
      ></script>
      {jsonLd && (
        // JSON-LD must be rendered on the server for SEO
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {/* Client component handles interactive product UI */}
      <ProductDetailClient params={{ slug }} />
    </>
  );
}
