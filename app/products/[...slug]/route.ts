import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Handles old URL redirects:
 * /products/category-slug/ → /category-slug
 * /products/category-slug/product-slug → /product-slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug: slugParts } = await params

    // If no slugs, let the default /products page handle it
    if (!slugParts || slugParts.length === 0) {
      return NextResponse.next()
    }

    // Case 1: /products/category-slug/ (single slug)
    if (slugParts.length === 1) {
      const slug = slugParts[0]

      // Check if it's a category
      const { data: categoryData } = await supabase
        .from('categories')
        .select('slug')
        .eq('slug', slug)
        .single()

      if (categoryData) {
        // Redirect to category slug
        return NextResponse.redirect(new URL(`/${slug}`, request.url), { status: 301 })
      }

      // Check if it's a subcategory
      const { data: subcatData } = await supabase
        .from('subcategories')
        .select('slug')
        .eq('slug', slug)
        .single()

      if (subcatData) {
        // Redirect to subcategory slug
        return NextResponse.redirect(new URL(`/${slug}`, request.url), { status: 301 })
      }

      // Check if it's a brand
      const { data: brandData } = await supabase
        .from('brands')
        .select('slug')
        .eq('slug', slug)
        .single()

      if (brandData) {
        // Redirect to brand slug
        return NextResponse.redirect(new URL(`/${slug}`, request.url), { status: 301 })
      }

      // Check if it's a product
      const { data: productData } = await supabase
        .from('products')
        .select('slug')
        .eq('slug', slug)
        .single()

      if (productData) {
        // Redirect to product slug
        return NextResponse.redirect(new URL(`/${slug}`, request.url), { status: 301 })
      }
    }

    // Case 2: /products/category-slug/product-slug (two slugs)
    if (slugParts.length === 2) {
      const [categorySlug, productSlug] = slugParts

      // Just redirect to the product slug, ignore category
      return NextResponse.redirect(new URL(`/${productSlug}`, request.url), { status: 301 })
    }

    // Case 3: More than 2 slugs - redirect to last slug
    if (slugParts.length > 2) {
      const productSlug = slugParts[slugParts.length - 1]
      return NextResponse.redirect(new URL(`/${productSlug}`, request.url), { status: 301 })
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error in products redirect route:', error)
    return NextResponse.next()
  }
}
