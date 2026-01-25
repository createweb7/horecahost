import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ProductWithRelations } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        brand:brands(*),
        category:categories(*),
        subcategory:subcategories(*)
      `
      )
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data as ProductWithRelations)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
