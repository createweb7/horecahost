import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const origin = new URL(request.url).origin

    // Fetch product slugs from the internal API
    const res = await fetch(`${origin}/api/products`)
    const data = await res.json()
    const products = Array.isArray(data.products) ? data.products : []

    const staticPages = ['/', '/products', '/brands', '/about', '/contact']

    const urls = []

    for (const page of staticPages) {
      urls.push({ loc: `${origin}${page}`, priority: '0.8' })
    }

    for (const p of products) {
      const slug = p.slug || p.url || ''
      if (!slug) continue
      const loc = `${origin}/${slug.replace(/^\//, '')}`
      const lastmod = p.updated_at || p.modified_at || p.updatedAt || new Date().toISOString()
      urls.push({ loc, lastmod, priority: '0.6' })
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => {
        return `  <url>\n    <loc>${u.loc}</loc>\n${u.lastmod ? `    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>\n` : ''}    <priority>${u.priority}</priority>\n  </url>`
      })
      .join('\n')}\n</urlset>`

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${new URL(request.url).origin}/</loc>\n    <priority>0.8</priority>\n  </url>\n</urlset>`
    return new Response(fallback, { headers: { 'Content-Type': 'application/xml' } })
  }
}
