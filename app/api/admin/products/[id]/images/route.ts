import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('Starting image upload for product:', id);
    
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('File received:', file.name, file.size, file.type);

    // Validate file is image
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, GIF, and WebP files are allowed' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    console.log('Buffer created, size:', buffer.byteLength);
    
    // Convert image to webp
    const webpBuffer = await sharp(Buffer.from(buffer))
      .webp({ quality: 80 })
      .toBuffer()
    
    console.log('Image converted to WebP, size:', webpBuffer.length);
    
    // Generate unique filename: post_xxxxx_productid.webp
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
    const filename = `post_${randomNum}_${id}.webp`
    const filePath = `${id}/${filename}`

    console.log('Uploading to Supabase:', filePath);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, webpBuffer, {
        contentType: 'image/webp',
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded successfully');

    // Get current product images
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', parseInt(id))
      .single()

    if (fetchError) {
      console.error('Fetch product error:', fetchError);
      throw fetchError;
    }

    console.log('Product fetched:', product);

    // Add new image to the array
    interface ImageObject {
      filename: string
      order: number
    }

    let images: ImageObject[] = product.images || []
    if (!Array.isArray(images)) {
      images = []
    }

    const maxOrder = images.length > 0 
      ? Math.max(...images.map((img: ImageObject) => img.order || 0)) 
      : 0

    images.push({
      filename: filename,
      order: maxOrder + 1,
    })

    // Update product with new images array
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ images, updated_at: new Date().toISOString() })
      .eq('id', parseInt(id))
      .select()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      filename: filename,
      images: updatedProduct[0].images,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
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
    const body = await request.json()
    const { filename } = body

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }

    const filePath = `${id}/${filename}`

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from('product-images')
      .remove([filePath])

    if (deleteError) throw deleteError

    // Get current product images
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', parseInt(id))
      .single()

    if (fetchError) throw fetchError

    // Remove image from array
    interface ImageObject {
      filename: string
      order: number
    }

    let images: ImageObject[] = product.images || []
    if (Array.isArray(images)) {
      images = images.filter((img: ImageObject) => img.filename !== filename)
    }

    // Update product with updated images array
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ images, updated_at: new Date().toISOString() })
      .eq('id', parseInt(id))
      .select()

    if (updateError) throw updateError
    if (!updatedProduct || !Array.isArray(updatedProduct) || updatedProduct.length === 0) {
      throw new Error('Failed to update product with new image')
    }

    return NextResponse.json({
      success: true,
      filename: filename,
      images: updatedProduct[0].images,
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Image upload error:', errorMessage, error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
