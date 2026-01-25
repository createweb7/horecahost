import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', parseInt(id))
      .single()

    if (error) throw error

    return NextResponse.json({ category: data })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errMsg },
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
    const { name_en, name_ar, slug, active } = body

    const { data, error } = await supabase
      .from('categories')
      .update({
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
      category: data?.[0],
      message: 'Category updated successfully',
    })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errMsg },
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
      .from('categories')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    return NextResponse.json({
      message: 'Category deleted successfully',
    })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    )
  }
}
