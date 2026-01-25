#!/usr/bin/env node

/**
 * SEO Metadata Editor Script - Multi-Country Version
 * Helps manually edit SEO metadata for specific products, countries, and languages
 * 
 * Usage: 
 *   node scripts/edit-seo-metadata.js <product_id> <country_code> [language]
 * Examples: 
 *   node scripts/edit-seo-metadata.js 5 AE          # Product 5, UAE, English (default)
 *   node scripts/edit-seo-metadata.js 5 AE ar       # Product 5, UAE, Arabic
 *   node scripts/edit-seo-metadata.js 5 SA en       # Product 5, Saudi Arabia, English
 */

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function editProductMetadata() {
  try {
    const productId = process.argv[2];
    const countryCode = process.argv[3];
    const language = (process.argv[4] || 'en').toLowerCase();

    if (!productId || !countryCode) {
      console.log('❌ Missing required parameters');
      console.log('\nUsage: node scripts/edit-seo-metadata.js <product_id> <country_code> [language]');
      console.log('Examples:');
      console.log('  node scripts/edit-seo-metadata.js 5 AE       # Product 5, UAE, English');
      console.log('  node scripts/edit-seo-metadata.js 5 AE ar    # Product 5, UAE, Arabic');
      console.log('  node scripts/edit-seo-metadata.js 5 SA en    # Product 5, Saudi Arabia, English');
      process.exit(1);
    }

    if (!['en', 'ar'].includes(language)) {
      console.log('❌ Invalid language. Use "en" or "ar"');
      process.exit(1);
    }

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        id,
        name_en,
        name_ar,
        subcategories(name_en, name_ar),
        brands(name_en, name_ar)
      `)
      .eq('id', parseInt(productId))
      .single();

    if (productError || !product) {
      console.log(`❌ Product ${productId} not found`);
      process.exit(1);
    }

    // Fetch country
    const { data: country, error: countryError } = await supabase
      .from('countries')
      .select('id, code, name')
      .eq('code', countryCode.toUpperCase())
      .single();

    if (countryError || !country) {
      console.log(`❌ Country ${countryCode} not found`);
      console.log('Available countries: AE, SA, QA, KW, BH, OM');
      process.exit(1);
    }

    // Fetch existing metadata
    const { data: metadata } = await supabase
      .from('product_metadata_locations')
      .select('*')
      .eq('product_id', parseInt(productId))
      .eq('country_code', countryCode.toUpperCase())
      .eq('language', language)
      .single();

    const productName = language === 'en' ? product.name_en : product.name_ar;
    const catName = language === 'en' 
      ? product.subcategories?.name_en 
      : product.subcategories?.name_ar;
    const brandName = language === 'en' 
      ? product.brands?.name_en 
      : product.brands?.name_ar;

    console.log('\n📝 Editing SEO Metadata');
    console.log('─'.repeat(60));
    console.log(`Product: ${productName}`);
    console.log(`Country: ${country.name} (${country.code})`);
    console.log(`Language: ${language === 'en' ? 'English' : 'العربية (Arabic)'}`);
    console.log(`Category: ${catName}`);
    console.log(`Brand: ${brandName}\n`);

    if (metadata) {
      console.log('Current Values:');
      console.log(`Title (${metadata.meta_title?.length || 0}/255): ${metadata.meta_title || 'N/A'}`);
      console.log(`Description (${metadata.meta_description?.length || 0}): ${metadata.meta_description || 'N/A'}`);
      console.log(`Keywords: ${metadata.meta_keywords || 'N/A'}\n`);
    } else {
      console.log('⚠️  No metadata found. This will be created.\n');
    }

    const newTitle = await question('New Title (leave blank to keep): ');
    const newDescription = await question('New Description (leave blank to keep): ');
    const newKeywords = await question('New Keywords (leave blank to keep): ');

    // Prepare data
    const updateData = {
      product_id: parseInt(productId),
      country_code: countryCode.toUpperCase(),
      language: language,
    };

    if (newTitle.trim()) updateData.meta_title = newTitle.substring(0, 255);
    if (newDescription.trim()) updateData.meta_description = newDescription;
    if (newKeywords.trim()) updateData.meta_keywords = newKeywords;

    if (Object.keys(updateData).length === 3) {
      console.log('\n⏭️  No changes made');
      rl.close();
      return;
    }

    // Upsert metadata
    const { error: upsertError } = await supabase
      .from('product_metadata_locations')
      .upsert(updateData, {
        onConflict: 'product_id,country_code,language'
      });

    if (upsertError) throw upsertError;

    console.log(`\n✅ Metadata updated for ${country.code} (${language})!`);
    rl.close();

  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

editProductMetadata();
