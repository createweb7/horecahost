import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the full image URL from Supabase Storage
 * @param productId - Product ID
 * @param filename - Image filename (e.g., "post_00000_001.webp")
 * @returns Full Supabase Storage URL
 */
export function getProductImageUrl(productId: number, filename: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${supabaseUrl}/storage/v1/object/public/product-images/${productId}/${filename}`
}

/**
 * Get all image URLs for a product from Supabase Storage
 * @param productId - Product ID
 * @param images - Array of ProductImage objects
 * @returns Array of full Supabase Storage URLs
 */
export function getProductImageUrls(productId: number, images: any[]): string[] {
  return images
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map(img => getProductImageUrl(productId, img.filename))
}

