import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from('subcategories')
      .select('*, categories(*)')
      .eq('id', parseInt(id))
      .single()

    if (error) throw error

    return NextResponse.json({ subcategory: data })
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
    const { category_id, name_en, name_ar, slug, active } = body

    const { data, error } = await supabase
      .from('subcategories')
      .update({
        category_id,
        name_en,
        name_ar,
        slug,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parseInt(id))
      .select()

    if (error) throw error

    return NextResponse.json({
      subcategory: data?.[0],
      message: 'Subcategory updated successfully',
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { error } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    return NextResponse.json({
      message: 'Subcategory deleted successfully',
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
