#!/usr/bin/env node

/**
 * Script to upload product images to Supabase Storage and populate the database
 * Images should be organized as: public/products/{product_id}/post_00000_*.webp
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Storage bucket name
const BUCKET_NAME = 'product-images';

async function populateProductImages() {
  try {
    console.log('Starting Supabase Storage image upload process...\n');

    // Check if bucket exists, if not create it
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      process.exit(1);
    }

    const bucketExists = buckets.some(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
      console.log(`Creating bucket: ${BUCKET_NAME}`);
      const { error: createError } = await supabase
        .storage
        .createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
        });

      if (createError) {
        console.error('Error creating bucket:', createError);
        process.exit(1);
      }
    }

    // Path to local images
    const localImagesPath = path.join(__dirname, '../public/products');
    
    // Check if local folder exists
    if (!fs.existsSync(localImagesPath)) {
      console.log(`❌ Images folder not found: ${localImagesPath}`);
      console.log('Please create the folder and add images');
      console.log('Expected format: post_{variant}_{product_id}.webp');
      console.log('Example: post_00110_101.webp, post_00111_101.webp');
      process.exit(1);
    }

    // Get all webp files from products folder
    const allFiles = fs.readdirSync(localImagesPath)
      .filter(file => file.endsWith('.webp'));

    if (allFiles.length === 0) {
      console.log(`❌ No WebP images found in ${localImagesPath}`);
      process.exit(1);
    }

    console.log(`Found ${allFiles.length} image files\n`);

    // Group images by product ID
    // Pattern: post_{variant}_{product_id}.webp
    const imagesByProductId = {};

    allFiles.forEach(filename => {
      const match = filename.match(/^post_\d+_(\d+)\.webp$/);
      if (match) {
        const productId = parseInt(match[1]);
        if (!imagesByProductId[productId]) {
          imagesByProductId[productId] = [];
        }
        imagesByProductId[productId].push(filename);
      } else {
        console.log(`⚠️  Skipping invalid filename format: ${filename}`);
      }
    });

    const productIds = Object.keys(imagesByProductId);
    console.log(`Found images for ${productIds.length} products\n`);

    let uploaded = 0;
    let failed = 0;

    for (const productIdStr of productIds) {
      const productId = parseInt(productIdStr);
      const files = imagesByProductId[productId].sort();

      const images = [];

      // Upload each image
      for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        const filePath = path.join(localImagesPath, filename);
        const storagePath = `${productId}/${filename}`;

        try {
          const fileBuffer = fs.readFileSync(filePath);

          const { error: uploadError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileBuffer, {
              contentType: 'image/webp',
              upsert: true, // Update if already exists
            });

          if (uploadError) {
            console.log(`  ❌ Failed to upload ${filename}: ${uploadError.message}`);
            failed++;
            continue;
          }

          images.push({
            filename: filename,
            order: i + 1
          });

          console.log(`  ✅ Uploaded: ${filename}`);
        } catch (err) {
          console.log(`  ❌ Error uploading ${filename}: ${err.message}`);
          failed++;
        }
      }

      // Update database with storage paths
      if (images.length > 0) {
        try {
          const { error: updateError } = await supabase
            .from('products')
            .update({ images })
            .eq('id', productId);

          if (updateError) {
            console.log(`❌ Product ${productId}: ${updateError.message}`);
            failed++;
          } else {
            console.log(`✅ Product ${productId}: ${images.length} image(s) uploaded\n`);
            uploaded++;
          }
        } catch (err) {
          console.log(`❌ Product ${productId}: ${err.message}`);
          failed++;
        }
      }
    }

    console.log(`\n✨ Complete! Uploaded: ${uploaded}, Failed: ${failed}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

populateProductImages();
