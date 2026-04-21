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
    let {
      brand_id,
      category_id,
      subcategory_id,
      name_en,
      name_ar,
      model,
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
      !model
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Auto-generate slug from name_en if not provided
    if (!slug || slug.trim() === '') {
      slug = name_en
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    }

    // Fix: Get the next ID manually since sequence might not be working properly
    const { data: maxIdData, error: maxIdError } = await supabase
      .from('products')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single()
    
    const nextId = maxIdData ? (maxIdData.id + 1) : 1

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          id: nextId,
          brand_id,
          category_id,
          subcategory_id,
          name_en,
          name_ar,
          model,
          slug,
          description_en,
          description_ar,
          meta_title,
          meta_description,
          meta_keywords,
          active: active !== false,
          images: [],
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(
      { product: data?.[0], message: 'Product created successfully' },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Product creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
