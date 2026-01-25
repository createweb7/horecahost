import React from "react";

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || process.env.SITE_ORIGIN || "http://localhost:3000";

export default async function Head({ params }: { params: { slug: string[] | string } }) {
  const slugArr = Array.isArray(params.slug) ? params.slug : [params.slug];
  const slugPath = slugArr.join("-");

  try {
    const res = await fetch(`${SITE_ORIGIN}/api/resolve-slug?slug=${encodeURIComponent(slugPath)}`);
    if (!res.ok) return null;
    const data = await res.json();

    if (data?.type === "product" && data?.data) {
      const product = data.data;
      const title = product.name_en || product.name || "Product";
      const description = (product.description_en || product.description || "").slice(0, 160);

      const images = (product.images || []).map((i: any) =>
        i.filename ? `${SITE_ORIGIN}/storage/v1/object/public/product-images/${product.id}/${i.filename}` : i.url || i.path
      );

      const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name_en || product.name,
        description: product.description_en || product.description,
        sku: product.sku || product.model || undefined,
        brand: product.brand ? { "@type": "Brand", name: product.brand.name_en || product.brand.name } : undefined,
        image: images,
        offers: {
          "@type": "Offer",
          priceCurrency: product.currency || "USD",
          price: (product.discount_price || product.price) || undefined,
          availability: product.stock && product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `${SITE_ORIGIN}/${product.slug}`,
        },
      };

      return (
        <>
          <title>{title}</title>
          <meta name="description" content={description} />
          <link rel="canonical" href={`${SITE_ORIGIN}/${product.slug}`} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          {images[0] && <meta property="og:image" content={images[0]} />}
          <meta property="og:url" content={`${SITE_ORIGIN}/${product.slug}`} />
          <meta property="og:type" content="product" />
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </>
      );
    }
  } catch (err) {
    // ignore errors; fallback to default head
  }

  return null;
}
