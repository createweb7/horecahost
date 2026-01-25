import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, count, error } = await supabase
      .from('brands')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ brands: data || [], total: count || 0 })
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
    const { name_en, name_ar, slug, country_en, country_ar, active } = body

    if (!name_en || !name_ar || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('brands')
      .insert([
        {
          name_en,
          name_ar,
          slug,
          country_en,
          country_ar,
          active: active !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(
      { brand: data?.[0], message: 'Brand created successfully' },
      { status: 201 }
    )
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
