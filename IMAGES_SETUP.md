# Product Images Setup Guide

## Folder Structure

Organize your product images in the following structure:

```
public/
└── products/
    ├── 313/
    │   ├── post_00000_001.webp
    │   ├── post_00000_002.webp
    │   └── post_00000_003.webp
    ├── 314/
    │   ├── post_00000_001.webp
    │   └── post_00000_002.webp
    └── 315/
        └── post_00000_001.webp
```

- Each product has its own folder named after the **product ID**
- Images are stored as `.webp` files
- Filename format: `post_00000_{order}.webp`

## Setup Steps

### 1. Create folders and add your images

Copy your images into `public/products/{product_id}/` directories

### 2. Run the population script

```bash
# Make sure env variables are set
export NEXT_PUBLIC_SUPABASE_URL=your_url
export SUPABASE_SERVICE_ROLE_KEY=your_key

# Run the script
node scripts/populate-product-images.js
```

This script will:
- Scan all product folders
- Extract filenames and sort by order
- Update the `products` table with image data

### 3. Use in your components

```tsx
import { getProductImageUrl, getProductImageUrls } from '@/lib/utils'
import Image from 'next/image'

// Get primary image
const primaryImageUrl = getProductImageUrl(product.id, product.images[0].filename)

// Get all images
const allImageUrls = getProductImageUrls(product.id, product.images)

// Use in component
<Image
  src={primaryImageUrl}
  alt={product.name_en}
  width={500}
  height={500}
/>
```

## Database Format

Images are stored in the `images` JSONB column as:

```json
{
  "images": [
    { "filename": "post_00000_001.webp", "order": 1 },
    { "filename": "post_00000_002.webp", "order": 2 },
    { "filename": "post_00000_003.webp", "order": 3 }
  ]
}
```
