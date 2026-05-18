import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from('products')
      .select('*, brands(*), categories(*), subcategories(*)')
      .eq('id', parseInt(id))
      .single()

    if (error) throw error

    return NextResponse.json({ product: data })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    let {
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

    // Auto-generate slug from name_en if not provided
    if (!slug || slug.trim() === '') {
      slug = name_en
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        brand_id: brand_id || null,
        category_id: category_id || null,
        subcategory_id: subcategory_id && subcategory_id > 0 ? subcategory_id : null,
        name_en,
        name_ar,
        slug,
        description_en,
        description_ar,
        meta_title,
        meta_description,
        meta_keywords,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parseInt(id))
      .select()

    if (error) throw new Error(error.message || JSON.stringify(error))

    return NextResponse.json({
      product: data?.[0],
      message: 'Product updated successfully',
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    return NextResponse.json({
      message: 'Product deleted successfully',
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
