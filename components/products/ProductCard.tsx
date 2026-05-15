import Image from "next/image";
import Link from "next/link";
import { ProductWithRelations } from "@/lib/types";
import { getProductImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: ProductWithRelations;
  locale: "en" | "ar";
  href?: string;
}

export default function ProductCard({ product, locale, href: hrefOverride }: ProductCardProps) {
  const name = locale === "en" ? product.name_en : product.name_ar;
  const href = hrefOverride ?? (locale === "en" ? `/${product.slug}` : `/ar/${product.slug}`);
  
  // Get primary image URL from Supabase Storage
  const imageUrl = product.images && product.images.length > 0
    ? getProductImageUrl(product.id, product.images[0].filename)
    : "/placeholder.png";

  return (
    <Link href={href}>
      <div className="group overflow-hidden rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md">
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden bg-white flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain p-2 transition group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {locale === "en" ? product.brand.name_en : product.brand.name_ar}
            </p>
          )}

          {/* Name */}
          <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900">
            {name}
          </h3>

          {/* Model */}
          {product.model && (
            <p className="text-xs text-gray-400 mt-1">Model: {product.model}</p>
          )}

          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 mt-3">
              {locale === "en"
                ? product.category.name_en
                : product.category.name_ar}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
