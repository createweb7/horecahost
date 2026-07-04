import { Metadata } from "next";
import Script from "next/script";
import SlugPageClient from "./SlugPageClient";
import CategoryPageSSR from "./CategoryPageSSR";
import SubcategoryPageSSR from "./SubcategoryPageSSR";
import BrandPageSSR from "./BrandPageSSR";
import ProductPageSSR from "./ProductPageSSR";
import { supabase } from "@/lib/supabase";
import { getProductImageUrls } from "@/lib/utils";
import { buildHeroText, serverCleanHTML } from "@/lib/html-utils";
import { ProductWithRelations, Brand, Category, Subcategory, SubcategoryWithRelations } from "@/lib/types";

export const revalidate = 3600;

const LIMIT = 12;
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://www.horecahost.com";

const sanitize = (text: string | null | undefined): string => {
  if (!text) return "";
  return String(text)
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, "").trim();
};

interface SlugPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const slugPath = Array.isArray(slug) ? slug.join("-") : slug;

    const { data: productData } = await supabase
      .from("products")
      .select("id, name_en, name_ar, slug, images, brand:brands(id, name_en, country_en), category:categories(name_en), subcategory:subcategories(name_en)")
      .eq("slug", slugPath)
      .maybeSingle();

    let contentType = null;
    let content: any = null;

    if (productData) {
      contentType = "product";
      content = productData;
    } else {
      const { data: categoryData } = await supabase.from("categories").select("id, name_en, name_ar, slug").eq("slug", slugPath).maybeSingle();
      if (categoryData) {
        contentType = "category";
        content = categoryData;
      } else {
        const { data: subcategoryData } = await supabase.from("subcategories").select("id, name_en, name_ar, slug, category:categories(name_en)").eq("slug", slugPath).maybeSingle();
        if (subcategoryData) {
          contentType = "subcategory";
          content = subcategoryData;
        } else {
          const { data: brandData } = await supabase.from("brands").select("id, name_en, name_ar, slug, country_en").eq("slug", slugPath).eq("active", true).maybeSingle();
          if (brandData) {
            contentType = "brand";
            content = brandData;
          }
        }
      }
    }

    if (!contentType || !content) {
      return { title: "Product Not Found | HorecaHost", description: "The product you are looking for could not be found." };
    }

    let title = "HorecaHost - Premium Hospitality & Kitchen Equipment";
    let description = "Your trusted supplier of premium hospitality and commercial kitchen equipment.";
    let keywords = ["horeca equipment", "commercial kitchen"];
    let ogImage = `/og-image.png`;
    let canonical = `${SITE_ORIGIN}`;

    if (contentType === "product") {
      const product = content;
      let metaTitle = title;
      let metaDescription = description;
      let metaKeywords: string[] = [];
      const { data: metadata } = await supabase.from("product_metadata_locations").select("meta_title, meta_description, meta_keywords").eq("product_id", product.id).eq("country_code", "AE").eq("language", "en").maybeSingle();
      if (metadata) {
        if (metadata.meta_title) metaTitle = sanitize(metadata.meta_title);
        if (metadata.meta_description) metaDescription = sanitize(metadata.meta_description);
        if (metadata.meta_keywords) metaKeywords = sanitize(metadata.meta_keywords).split(",").map((k: string) => k.trim());
      }
      title = metaTitle;
      description = metaDescription;
      keywords = metaKeywords.length > 0 ? metaKeywords : [product.name_en || product.name_ar, product.category?.name_en, product.brand?.name_en, "horeca equipment", "commercial kitchen"].filter(Boolean);
      if (product.images?.[0]?.filename) ogImage = `/storage/v1/object/public/product-images/${product.id}/${product.images[0].filename}`;
      canonical = `${SITE_ORIGIN}/${product.slug}`;
    } else if (contentType === "category") {
      const category = content;
      let metaTitle = `${category.name_en} | HorecaHost`;
      let metaDescription = `Browse our collection of ${category.name_en} for premium hospitality and restaurant equipment solutions.`;
      let metaKeywords: string[] = [];
      const { data: metadata } = await supabase.from("category_metadata_locations").select("meta_title, meta_description, meta_keywords").eq("category_id", category.id).eq("country_code", "AE").eq("language", "en").maybeSingle();
      if (metadata) {
        if (metadata.meta_title) metaTitle = sanitize(metadata.meta_title);
        if (metadata.meta_description) metaDescription = sanitize(metadata.meta_description);
        if (metadata.meta_keywords) metaKeywords = sanitize(metadata.meta_keywords).split(",").map((k: string) => k.trim());
      }
      title = metaTitle;
      description = metaDescription;
      keywords = metaKeywords.length > 0 ? metaKeywords : [category.name_en, "horeca equipment", "commercial kitchen"].filter(Boolean);
      canonical = `${SITE_ORIGIN}/${slug.join("/")}`;
    } else if (contentType === "subcategory") {
      const subcategory = content;
      let metaTitle = `${subcategory.name_en} | HorecaHost`;
      let metaDescription = `Explore ${subcategory.name_en} - premium equipment for hospitality professionals.`;
      let metaKeywords: string[] = [];
      const { data: metadata } = await supabase.from("subcategory_metadata_locations").select("meta_title, meta_description, meta_keywords").eq("subcategory_id", subcategory.id).eq("country_code", "AE").eq("language", "en").maybeSingle();
      if (metadata) {
        if (metadata.meta_title) metaTitle = sanitize(metadata.meta_title);
        if (metadata.meta_description) metaDescription = sanitize(metadata.meta_description);
        if (metadata.meta_keywords) metaKeywords = sanitize(metadata.meta_keywords).split(",").map((k: string) => k.trim());
      }
      title = metaTitle;
      description = metaDescription;
      keywords = metaKeywords.length > 0 ? metaKeywords : [subcategory.name_en, subcategory.category?.name_en, "horeca equipment"].filter(Boolean);
      canonical = `${SITE_ORIGIN}/${slug.join("/")}`;
    } else if (contentType === "brand") {
      const brand = content;
      let metaTitle = `${brand.name_en} - Equipment & Products | HorecaHost`;
      let metaDescription = `Explore ${brand.name_en} products from ${brand.country_en}. Premium hospitality and commercial kitchen equipment.`;
      let metaKeywords: string[] = [];
      const { data: metadata, error } = await supabase.from("brand_metadata_locations").select("meta_title, meta_description, meta_keywords").eq("brand_id", brand.id).eq("country_code", "AE").eq("language", "en").maybeSingle();
      if (metadata) {
        if (metadata.meta_title) metaTitle = sanitize(metadata.meta_title);
        if (metadata.meta_description) metaDescription = sanitize(metadata.meta_description);
        if (metadata.meta_keywords) metaKeywords = sanitize(metadata.meta_keywords).split(",").map((k: string) => k.trim());
      } else if (!error) {
        const { data: anyMetadata } = await supabase.from("brand_metadata_locations").select("meta_title, meta_description, meta_keywords").eq("brand_id", brand.id).limit(1).maybeSingle();
        if (anyMetadata) {
          if (anyMetadata.meta_title) metaTitle = sanitize(anyMetadata.meta_title);
          if (anyMetadata.meta_description) metaDescription = sanitize(anyMetadata.meta_description);
          if (anyMetadata.meta_keywords) metaKeywords = sanitize(anyMetadata.meta_keywords).split(",").map((k: string) => k.trim());
        }
      }
      title = metaTitle;
      description = metaDescription;
      keywords = metaKeywords.length > 0 ? metaKeywords : [brand.name_en, brand.country_en, "horeca equipment"].filter(Boolean);
      canonical = `${SITE_ORIGIN}/${slug.join("/")}`;
    }

    return {
      title,
      description,
      keywords,
      authors: [{ name: "HorecaHost" }],
      creator: "HorecaHost",
      robots: "index, follow",
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        siteName: "HorecaHost",
        images: [{ url: ogImage.startsWith("http") ? ogImage : `${SITE_ORIGIN}${ogImage}`, width: 1200, height: 630, alt: title }],
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        creator: "@horecahost",
        images: [ogImage.startsWith("http") ? ogImage : `${SITE_ORIGIN}${ogImage}`],
      },
      alternates: { canonical },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "HorecaHost - Premium Hospitality & Kitchen Equipment",
      description: "Your trusted supplier of premium hospitality and commercial kitchen equipment.",
    };
  }
}

async function fetchProductsPage(filter: { category?: number; brand?: number; subcategory?: number }) {
  let query = supabase
    .from("products")
    .select("*, brand:brands(*), category:categories(*), subcategory:subcategories(*)", { count: "exact" })
    .eq("active", true)
    .order("created_at", { ascending: false })
    .range(0, LIMIT - 1);
  if (filter.category) query = query.eq("category_id", filter.category);
  if (filter.brand) query = query.eq("brand_id", filter.brand);
  if (filter.subcategory) query = query.eq("subcategory_id", filter.subcategory);
  const { data, count } = await query;
  return { products: (data || []) as ProductWithRelations[], total: count || 0 };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("-") : slug;

  // --- Resolve content type ---
  const { data: product } = await supabase
    .from("products")
    .select("*, brand:brands(*), category:categories(*), subcategory:subcategories(*)")
    .eq("slug", slugPath)
    .eq("active", true)
    .maybeSingle();

  if (product) {
    const imageUrls = product.images?.length > 0 ? getProductImageUrls(product.id, product.images) : [];
    const cleanDescription = serverCleanHTML(product.description_en || "");

    const brandData = product.brand && typeof product.brand === "object" && "name_en" in product.brand
      ? { "@type": "Brand", name: (product.brand as any).name_en }
      : undefined;

    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name_en,
      description: product.description_en?.replace(/<[^>]*>/g, "").slice(0, 200),
      brand: brandData,
      image: imageUrls[0] ? [imageUrls[0]] : undefined,
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.discount_price || product.price,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `${SITE_ORIGIN}/${product.slug}`,
      },
    };

    const breadcrumbItems: any[] = [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_ORIGIN}/products` },
    ];
    if (product.category) {
      breadcrumbItems.push({ "@type": "ListItem", position: 3, name: (product.category as any).name_en, item: `${SITE_ORIGIN}/${(product.category as any).slug}` });
      if (product.subcategory) {
        breadcrumbItems.push({ "@type": "ListItem", position: 4, name: (product.subcategory as any).name_en, item: `${SITE_ORIGIN}/${(product.subcategory as any).slug}` });
        breadcrumbItems.push({ "@type": "ListItem", position: 5, name: product.name_en, item: `${SITE_ORIGIN}/${product.slug}` });
      } else {
        breadcrumbItems.push({ "@type": "ListItem", position: 4, name: product.name_en, item: `${SITE_ORIGIN}/${product.slug}` });
      }
    } else {
      breadcrumbItems.push({ "@type": "ListItem", position: 3, name: product.name_en, item: `${SITE_ORIGIN}/${product.slug}` });
    }

    const schemas = [productSchema, { "@context": "https://schema.org/", "@type": "BreadcrumbList", itemListElement: breadcrumbItems }];

    return (
      <>
        {schemas.map((schema, idx) => (
          <script key={idx} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        ))}
        <Script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} strategy="beforeInteractive" />
        <ProductPageSSR product={product as ProductWithRelations} imageUrls={imageUrls} cleanDescription={cleanDescription} />
      </>
    );
  }

  // Try brand
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slugPath)
    .eq("active", true)
    .maybeSingle();

  if (brand) {
    const [productsResult, brandProductsRaw, metadataResult] = await Promise.all([
      fetchProductsPage({ brand: brand.id }),
      supabase.from("products").select("subcategory:subcategories(id, name_en, name_ar, slug, category_id, category:categories(*))").eq("brand_id", brand.id).eq("active", true).not("subcategory_id", "is", null),
      supabase.from("brand_metadata_locations").select("h1_tag, h2_tag, paragraph_text, meta_title, meta_description").eq("brand_id", brand.id).eq("country_code", "AE").eq("language", "en").maybeSingle(),
    ]);

    // Deduplicate subcategories and count products per subcategory
    const subcatMap = new Map<number, any & { productCount: number }>();
    (brandProductsRaw.data || []).forEach((row: any) => {
      const sub = row.subcategory;
      if (sub && typeof sub === "object" && "id" in sub) {
        if (!subcatMap.has(sub.id)) subcatMap.set(sub.id, { ...sub, productCount: 0 });
        subcatMap.get(sub.id)!.productCount += 1;
      }
    });
    const subcatsWithCount = Array.from(subcatMap.values()).sort((a, b) => a.name_en.localeCompare(b.name_en));

    const heroText = buildHeroText(metadataResult.data, brand.name_en);
    const brandBreadcrumb = {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_ORIGIN}/brands` },
        { "@type": "ListItem", position: 3, name: brand.name_en, item: `${SITE_ORIGIN}/${brand.slug}` },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandBreadcrumb) }} />
        <BrandPageSSR
          brand={brand as Brand}
          heroText={heroText}
          initialProducts={productsResult.products}
          totalProducts={productsResult.total}
          subcategories={subcatsWithCount as any}
        />
      </>
    );
  }

  // Try category
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slugPath)
    .eq("active", true)
    .maybeSingle();

  if (category) {
    const [productsResult, subcategoriesResult, metadataResult] = await Promise.all([
      fetchProductsPage({ category: category.id }),
      supabase.from("subcategories").select("*").eq("category_id", category.id).eq("active", true).order("name_en"),
      supabase.from("category_metadata_locations").select("h1_tag, h2_tag, paragraph_text, meta_title, meta_description").eq("category_id", category.id).eq("country_code", "AE").eq("language", "en").maybeSingle(),
    ]);

    const heroText = buildHeroText(metadataResult.data, category.name_en);
    const categoryBreadcrumb = {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_ORIGIN}/products` },
        { "@type": "ListItem", position: 3, name: category.name_en, item: `${SITE_ORIGIN}/${category.slug}` },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryBreadcrumb) }} />
        <CategoryPageSSR
          category={category as Category}
          heroText={heroText}
          initialProducts={productsResult.products}
          totalProducts={productsResult.total}
          subcategories={(subcategoriesResult.data || []) as Subcategory[]}
          slugPath={slugPath}
        />
      </>
    );
  }

  // Try subcategory
  const { data: subcategory } = await supabase
    .from("subcategories")
    .select("*, category:categories(*)")
    .eq("slug", slugPath)
    .eq("active", true)
    .maybeSingle();

  if (subcategory) {
    const [productsResult, metadataResult] = await Promise.all([
      fetchProductsPage({ subcategory: subcategory.id }),
      supabase.from("subcategory_metadata_locations").select("h1_tag, h2_tag, paragraph_text, meta_title, meta_description").eq("subcategory_id", subcategory.id).eq("country_code", "AE").eq("language", "en").maybeSingle(),
    ]);

    const heroText = buildHeroText(metadataResult.data, subcategory.name_en);
    const subcategoryBreadcrumb = {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_ORIGIN}/products` },
        ...(subcategory.category ? [{ "@type": "ListItem", position: 3, name: (subcategory.category as any).name_en, item: `${SITE_ORIGIN}/${(subcategory.category as any).slug}` }] : []),
        { "@type": "ListItem", position: subcategory.category ? 4 : 3, name: subcategory.name_en, item: `${SITE_ORIGIN}/${subcategory.slug}` },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(subcategoryBreadcrumb) }} />
        <SubcategoryPageSSR
          subcategory={subcategory as SubcategoryWithRelations}
          heroText={heroText}
          initialProducts={productsResult.products}
          totalProducts={productsResult.total}
        />
      </>
    );
  }

  // Fall through: brand-subcategory compound slugs — keep existing client-side component
  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="beforeInteractive"
      />
      <SlugPageClient params={params} />
    </>
  );
}
