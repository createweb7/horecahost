import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin

    const urls: Array<{ loc: string; lastmod?: string; priority: string; changefreq?: string }> = []

    // Static pages with higher priority
    const staticPages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/products', priority: '0.9', changefreq: 'daily' },
      { path: '/brands', priority: '0.8', changefreq: 'weekly' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly' },
    ]

    for (const page of staticPages) {
      urls.push({
        loc: `${baseUrl}${page.path}`,
        priority: page.priority,
        changefreq: page.changefreq,
      })
    }

    // Fetch all active products
    let allProducts = []
    let page = 1
    const pageSize = 100

    while (true) {
      const { data, error } = await supabase
        .from('products')
        .select('id, slug, updated_at')
        .eq('active', true)
        .order('updated_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (error) {
        console.error('Error fetching products:', error)
        break
      }

      if (!data || data.length === 0) break
      allProducts = allProducts.concat(data)
      if (data.length < pageSize) break
      page++
    }

    for (const product of allProducts) {
      if (product.slug) {
        urls.push({
          loc: `${baseUrl}/${product.slug}`,
          lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : undefined,
          priority: '0.7',
          changefreq: 'weekly',
        })
      }
    }

    // Fetch all active categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, slug, updated_at')
      .eq('active', true)
      .order('updated_at', { ascending: false })

    if (!catError && categories) {
      for (const category of categories) {
        if (category.slug) {
          urls.push({
            loc: `${baseUrl}/categories/${category.slug}`,
            lastmod: category.updated_at ? new Date(category.updated_at).toISOString().split('T')[0] : undefined,
            priority: '0.7',
            changefreq: 'weekly',
          })
        }
      }
    }

    // Fetch all active subcategories
    const { data: subcategories, error: subError } = await supabase
      .from('subcategories')
      .select('id, slug, category_id, updated_at')
      .eq('active', true)
      .order('updated_at', { ascending: false })

    if (!subError && subcategories) {
      for (const subcategory of subcategories) {
        if (subcategory.slug) {
          urls.push({
            loc: `${baseUrl}/subcategories/${subcategory.slug}`,
            lastmod: subcategory.updated_at ? new Date(subcategory.updated_at).toISOString().split('T')[0] : undefined,
            priority: '0.6',
            changefreq: 'weekly',
          })
        }
      }
    }

    // Fetch all active brands
    const { data: brands, error: brandError } = await supabase
      .from('brands')
      .select('id, slug, updated_at')
      .eq('active', true)
      .order('updated_at', { ascending: false })

    if (!brandError && brands) {
      for (const brand of brands) {
        if (brand.slug) {
          urls.push({
            loc: `${baseUrl}/brands/${brand.slug}`,
            lastmod: brand.updated_at ? new Date(brand.updated_at).toISOString().split('T')[0] : undefined,
            priority: '0.6',
            changefreq: 'weekly',
          })
        }
      }
    }

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => {
    return `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ''}
    <priority>${u.priority}</priority>
  </url>`
  })
  .join('\n')}
</urlset>`

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('Sitemap generation error:', err)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
</urlset>`
    return new Response(fallback, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return c
    }
  })
}
