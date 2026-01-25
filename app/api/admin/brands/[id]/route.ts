import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', parseInt(id))
      .single()

    if (error) throw error

    return NextResponse.json({ brand: data })
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
    const { name_en, name_ar, slug, country_en, country_ar, active } = body

    const { data, error } = await supabase
      .from('brands')
      .update({
        name_en,
        name_ar,
        slug,
        country_en,
        country_ar,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parseInt(id))
      .select()

    if (error) throw error

    return NextResponse.json({
      brand: data?.[0],
      message: 'Brand updated successfully',
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
      .from('brands')
      .delete()
      .eq('id', parseInt(id))

    if (error) throw error

    return NextResponse.json({
      message: 'Brand deleted successfully',
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
