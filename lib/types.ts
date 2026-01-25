export interface Brand {
  id: number
  name_en: string
  name_ar: string
  slug: string
  country_en: string | null
  country_ar: string | null
  image_path: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name_en: string
  name_ar: string
  slug: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Subcategory {
  id: number
  category_id: number
  name_en: string
  name_ar: string
  slug: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface SubcategoryWithRelations extends Subcategory {
  category?: Category
}

export interface ProductImage {
  filename: string
  order: number
}

export interface Product {
  id: number
  brand_id: number
  category_id: number
  subcategory_id: number
  name_en: string
  name_ar: string
  model: string
  slug: string
  price: number
  discount_price: number | null
  description_en: string
  description_ar: string
  specifications: Record<string, any>
  images: ProductImage[]
  active: boolean
  created_at: string
  updated_at: string
}

export interface Country {
  id: number
  name: string
  code: string  // 'AE', 'SA', 'QA', etc
  region: string
  created_at: string
}

export interface ProductMetadataLocation {
  id: number
  product_id: number
  country_code: string
  language: string  // 'en' or 'ar'
  meta_title: string
  meta_description: string
  meta_keywords: string
  created_at: string
  updated_at: string
}

export interface ProductWithRelations extends Product {
  brand?: Brand
  category?: Category
  subcategory?: Subcategory
  metadata?: ProductMetadataLocation[]
}


