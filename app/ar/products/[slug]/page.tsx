'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import DOMPurify from 'dompurify'
import { ProductWithRelations } from '@/lib/types'
import { getProductImageUrls } from '@/lib/utils'

// Helper function to clean HTML and rejoin split sentences
const cleanHTML = (html: string): string => {
  // First sanitize the HTML
  let sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
  
  // Remove HTML entities and normalize whitespace
  sanitized = sanitized
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8226;/g, '•')
    .replace(/&#8217;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\r/g, ''); // Remove carriage returns
  
  // Remove empty paragraphs
  sanitized = sanitized.replace(/<p>[\s•]*<\/p>/g, '');
  
  // Extract all paragraph contents
  const paragraphRegex = /<p>(.*?)<\/p>/g;
  const paragraphs: string[] = [];
  let match;
  
  while ((match = paragraphRegex.exec(sanitized)) !== null) {
    let text = match[1].trim();
    // Remove all leading bullets and whitespace - there might be multiple bullets in the data
    text = text.replace(/^[•\s]+/, '').trim();
    if (text) paragraphs.push(text);
  }
  
  // Smart joining: join paragraphs that represent the same bullet point
  const result: string[] = [];
  let i = 0;
  
  while (i < paragraphs.length) {
    let current = paragraphs[i];
    let nextIndex = i + 1;
    
    // Check if this paragraph ends with a sentence-ending punctuation
    let endsWithPunctuation = /[.!?:;—]\s*$/.test(current);
    
    // Keep joining paragraphs until we hit one that ends with punctuation
    while (!endsWithPunctuation && nextIndex < paragraphs.length) {
      const next = paragraphs[nextIndex];
      
      // Don't join if the next paragraph looks like a section header
      if (/^(Standard features|Dimensions|Options|Features|Specifications|Includes|Additional)/i.test(next)) {
        break;
      }
      
      // Join with space
      current = current + ' ' + next;
      nextIndex++;
      endsWithPunctuation = /[.!?:;—]\s*$/.test(current);
    }
    
    // Add the complete bullet point
    if (current.trim()) {
      result.push(`<p>• ${current}</p>`);
    }
    
    // Move to the next unprocessed paragraph
    i = nextIndex;
  }
  
  return result.join('');
};

interface ProductDetailPageProps {
  params: { slug: string }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<ProductWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">جاري التحميل...</p>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">لم يتم العثور على المنتج</p>
      </main>
    )
  }

  const displayPrice = product.discount_price || product.price
  const originalPrice = product.discount_price ? product.price : null
  const images = product.images && product.images.length > 0
    ? getProductImageUrls(product.id, product.images)
    : ['/placeholder.png']

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <a href="/ar/products" className="hover:text-gray-700">
            المنتجات
          </a>
          {product.category && (
            <>
              {' / '}
              <span>{product.category.name_ar}</span>
            </>
          )}
          {' / '}
          <span className="text-gray-900">{product.name_ar}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Images */}
          <div>
            <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-white flex items-center justify-center border border-gray-200">
              <Image
                src={images[selectedImage]}
                alt={product.name_ar}
                fill
                className="object-contain p-4"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded border-2 bg-white flex items-center justify-center ${
                      selectedImage === index
                        ? 'border-blue-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name_ar} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {product.brand.name_ar}
              </p>
            )}

            {/* Name */}
            <h1 className="mt-2 text-4xl font-bold text-gray-900">
              {product.name_ar}
            </h1>

            {/* Model */}
            {product.model && (
              <p className="mt-2 text-gray-600">
                <strong>الموديل:</strong> {product.model}
              </p>
            )}

            {/* Category */}
            {product.category && (
              <p className="mt-2 text-gray-600">
                <strong>الفئة:</strong> {product.category.name_ar}
                {product.subcategory && ` / ${product.subcategory.name_ar}`}
              </p>
            )}

            {/* Price */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">
                ${displayPrice.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              {product.discount_price && (
                <span className="rounded bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                  -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">
                الوصف
              </h2>
              <div
                className="text-gray-700 leading-relaxed [&_p]:mb-3"
                dangerouslySetInnerHTML={{
                  __html: cleanHTML(product.description_ar || ''),
                }}
              />
            </div>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  المواصفات
                </h2>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-semibold text-gray-900">{key}</dt>
                      <dd className="text-gray-600">
                        {typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Add to Cart Button */}
            <button className="mt-8 w-full rounded-lg bg-blue-600 px-8 py-3 text-center font-semibold text-white hover:bg-blue-700 transition">
              أضف إلى السلة
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
