import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, count, error } = await supabase
      .from('products')
      .select('id, name_en, name_ar, brand_id, category_id, subcategory_id, slug, active, brands(name_en), categories(name_en), subcategories(name_en)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ products: data || [], total: count || 0 })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      brand_id,
      category_id,
      subcategory_id,
      name_en,
      name_ar,
      slug,
      description_en,
      description_ar,
      meta_title,
      meta_description,
      meta_keywords,
      active,
    } = body

    if (
      !brand_id ||
      !category_id ||
      !subcategory_id ||
      !name_en ||
      !name_ar ||
      !slug
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          brand_id,
          category_id,
          subcategory_id,
          name_en,
          name_ar,
          slug,
          description_en,
          description_ar,
          meta_title,
          meta_description,
          meta_keywords,
          active: active !== false,
          images: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(
      { product: data?.[0], message: 'Product created successfully' },
      { status: 201 }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
