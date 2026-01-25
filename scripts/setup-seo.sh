#!/bin/bash

# SEO Metadata Setup - Quick Start Script
# Runs all steps needed to generate SEO for 400+ products

echo "🚀 HorecaHost SEO Metadata Setup"
echo "================================\n"

echo "⚠️  IMPORTANT: Before running this script:"
echo "1. Go to Supabase Dashboard → SQL Editor"
echo "2. Run this SQL first:\n"

cat << 'EOF'
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_keywords TEXT;
CREATE INDEX IF NOT EXISTS idx_products_meta_title ON products(meta_title);
EOF

echo "\n\n✅ Press Enter once you've run the SQL migration..."
read -p ""

echo "\n🔄 Generating SEO metadata for all products...\n"
node scripts/generate-seo-metadata.js

echo "\n\n📊 Generating SEO report...\n"
node scripts/seo-report.js 50

echo "\n\n📝 Next Steps:"
echo "1. Review the generated metadata in Supabase"
echo "2. For each top product, run: node scripts/edit-seo-metadata.js <id>"
echo "3. Test the site to verify metadata appears"
echo "\n✨ Setup complete!"
