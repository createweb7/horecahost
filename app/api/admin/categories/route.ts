import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, count, error } = await supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ categories: data || [], total: count || 0 })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name_en, name_ar, slug, active } = body

    if (!name_en || !name_ar || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
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
      { category: data?.[0], message: 'Category created successfully' },
      { status: 201 }
    )
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    )
  }
}
