import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, count, error } = await supabase
      .from('subcategories')
      .select('*, category:categories(*)', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ subcategories: data || [], total: count || 0 })
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
    const { category_id, name_en, name_ar, slug, active } = body

    if (!category_id || !name_en || !name_ar || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('subcategories')
      .insert([
        {
          category_id,
          name_en,
          name_ar,
          slug,
          active: active !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(
      { subcategory: data?.[0], message: 'Subcategory created successfully' },
      { status: 201 }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
