#!/usr/bin/env node

/**
 * Brand SEO Metadata Generator
 * Populates brand_metadata_locations for every active brand across all markets
 * (AE/Dubai, SA/Riyadh, MU/Mauritius, MV/Maldives). Skips any brand+country+language
 * combination that already has a row, so manually curated entries are never overwritten.
 *
 * Usage:
 *   node scripts/generate-brand-metadata.js                # all countries
 *   node scripts/generate-brand-metadata.js --country AE    # single country
 *   node scripts/generate-brand-metadata.js --dry-run       # preview only, no writes
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const args = process.argv.slice(2);
const countryFilter = args.includes('--country') ? args[args.indexOf('--country') + 1].toUpperCase() : null;
const dryRun = args.includes('--dry-run');
const regenerate = args.includes('--regenerate');

// Brand IDs with hand-written metadata — never touched by --regenerate.
const CURATED_BRAND_IDS = [8]; // Hamilton Beach

const MARKETS = [
  { code: 'AE', location: 'Dubai', region: 'the UAE' },
  { code: 'SA', location: 'Riyadh', region: 'Saudi Arabia' },
  { code: 'MU', location: 'Mauritius', region: 'Mauritius' },
  { code: 'MV', location: 'Maldives', region: 'the Maldives' },
];

const h1Templates = [
  (brand, location) => `${brand} in ${location}`,
  (brand, location) => `${brand} Equipment in ${location}`,
  (brand, location) => `${brand} Supplier in ${location}`,
  (brand, location) => `${brand} – ${location}`,
];

const h2Templates = [
  (brand, specialty) => specialty
    ? `Trusted ${brand} ${specialty} Supplier for Hotels & Restaurants`
    : `Trusted ${brand} Solutions for Hotels & Restaurants`,
  (brand, specialty) => specialty
    ? `Premium ${brand} ${specialty} for Hospitality Businesses`
    : `Premium ${brand} Equipment for Hospitality Businesses`,
  (brand, specialty) => specialty
    ? `Reliable ${brand} ${specialty} for Professional Kitchens`
    : `Reliable ${brand} Performance for Professional Kitchens`,
  (brand, specialty) => specialty
    ? `Durable ${brand} ${specialty} Built for Commercial Use`
    : `Durable ${brand} Equipment Built for Commercial Use`,
];

const paragraphTemplates = [
  (brand, origin, location, region) =>
    `${brand}${origin ? ` (${origin})` : ''} offers reliable, high-performance commercial kitchen equipment designed for hotels, restaurants, cafés, and catering businesses. At HorecaHost, we supply genuine ${brand} products in ${location} and across ${region}, ensuring durability, efficiency, and professional results for every kitchen operation.`,
  (brand, origin, location, region) =>
    `HorecaHost is a trusted supplier of ${brand}${origin ? ` (${origin})` : ''} commercial equipment in ${location}. Built for hospitality professionals across ${region}, ${brand} equipment delivers consistent performance for hotels, restaurants, and catering operations of every scale.`,
  (brand, origin, location, region) =>
    `Explore our range of ${brand} equipment, supplied to hotels, restaurants, and foodservice businesses across ${region}. HorecaHost delivers genuine ${brand} products in ${location}, backed by expert support and fast regional shipping.`,
  (brand, origin, location, region) =>
    `${brand}${origin ? ` (${origin})` : ''} is a globally recognized name in commercial kitchen equipment. HorecaHost brings ${brand}'s full range to ${location}, supporting hotels, restaurants, and catering operations throughout ${region} with genuine, warrantied equipment.`,
];

const metaTitleTemplates = [
  (brand, location) => `${brand} Commercial Kitchen Equipment ${location} – HorecaHost`,
  (brand, location) => `Buy ${brand} Equipment in ${location} | HorecaHost`,
  (brand, location) => `${brand} Hospitality Equipment Supplier ${location} | HorecaHost`,
];

const metaDescriptionTemplates = [
  (brand, location) => `Buy ${brand} commercial kitchen equipment in ${location} from HorecaHost. Ideal for hotels, restaurants & catering businesses. Bulk & B2B supply.`,
  (brand, location) => `Shop genuine ${brand} equipment in ${location} with HorecaHost. Trusted by hotels, restaurants & caterers. Expert support and fast delivery.`,
  (brand, location) => `HorecaHost supplies ${brand} commercial kitchen equipment across ${location}. Premium quality, competitive pricing, and reliable B2B service.`,
];

function truncate(str, max) {
  return str.length > max ? str.slice(0, max - 1).trimEnd() + '…' : str;
}

function buildRow(brand, market, templateIndex) {
  const h1 = h1Templates[templateIndex % h1Templates.length](brand.name_en, market.location);
  const h2 = h2Templates[templateIndex % h2Templates.length](brand.name_en, brand.specialty);
  const paragraph = paragraphTemplates[templateIndex % paragraphTemplates.length](
    brand.name_en,
    brand.country_en,
    market.location,
    market.region,
  );
  const metaTitle = truncate(
    metaTitleTemplates[templateIndex % metaTitleTemplates.length](brand.name_en, market.location),
    255,
  );
  const metaDescription = truncate(
    metaDescriptionTemplates[templateIndex % metaDescriptionTemplates.length](brand.name_en, market.location),
    160,
  );
  const metaKeywords = [
    brand.name_en,
    `${brand.name_en} ${market.location}`,
    'commercial kitchen equipment',
    'hospitality equipment supplier',
    market.location,
  ].join(', ');

  return {
    brand_id: brand.id,
    country_code: market.code,
    language: 'en',
    h1_tag: h1,
    h2_tag: h2,
    paragraph_text: paragraph,
    meta_title: metaTitle,
    meta_description: metaDescription,
    meta_keywords: metaKeywords,
  };
}

async function main() {
  console.log('🚀 Generating brand SEO metadata...\n');

  const markets = countryFilter ? MARKETS.filter((m) => m.code === countryFilter) : MARKETS;
  if (countryFilter && markets.length === 0) {
    console.error(`❌ Unknown country code: ${countryFilter}`);
    process.exit(1);
  }

  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('id, name_en, country_en')
    .eq('active', true)
    .order('id');

  if (brandsError) {
    console.error('❌ Failed to fetch brands:', brandsError.message);
    process.exit(1);
  }

  console.log(`📊 Found ${brands.length} active brands`);
  console.log(`🌍 Processing ${markets.length} market(s): ${markets.map((m) => m.code).join(', ')}\n`);

  // Give each brand a real per-brand hook (its best-selling product category) so
  // templated copy doesn't read identically across unrelated brands.
  console.log('🔍 Resolving each brand\'s top product category...');
  for (const brand of brands) {
    const { data: rows } = await supabase
      .from('products')
      .select('subcategory:subcategories(name_en)')
      .eq('brand_id', brand.id)
      .eq('active', true)
      .not('subcategory_id', 'is', null);

    const counts = new Map();
    for (const row of rows || []) {
      const name = row.subcategory && typeof row.subcategory === 'object' ? row.subcategory.name_en : null;
      if (!name) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
    let top = null;
    let topCount = 0;
    for (const [name, count] of counts) {
      if (count > topCount) {
        top = name;
        topCount = count;
      }
    }
    brand.specialty = top;
  }
  console.log('✅ Specialty categories resolved\n');

  if (regenerate) {
    const regenBrandIds = brands.map((b) => b.id).filter((id) => !CURATED_BRAND_IDS.includes(id));
    console.log(`🗑️  Regenerating: deleting existing auto-generated rows for ${regenBrandIds.length} brands...`);
    let deleteQuery = supabase
      .from('brand_metadata_locations')
      .delete()
      .in('brand_id', regenBrandIds);
    if (countryFilter) deleteQuery = deleteQuery.eq('country_code', countryFilter);
    const { error: deleteError } = await deleteQuery;
    if (deleteError) {
      console.error('❌ Failed to delete existing rows:', deleteError.message);
      process.exit(1);
    }
    console.log('✅ Deleted\n');
  }

  const { data: existing, error: existingError } = await supabase
    .from('brand_metadata_locations')
    .select('brand_id, country_code, language');

  if (existingError) {
    console.error('❌ Failed to fetch existing metadata:', existingError.message);
    process.exit(1);
  }

  const existingSet = new Set(
    existing.map((row) => `${row.brand_id}:${row.country_code}:${row.language}`),
  );

  const rowsToInsert = [];
  let templateIndex = 0;
  for (const brand of brands) {
    for (const market of markets) {
      const key = `${brand.id}:${market.code}:en`;
      if (existingSet.has(key)) continue;
      rowsToInsert.push(buildRow(brand, market, templateIndex));
      templateIndex++;
    }
  }

  console.log(`📝 ${rowsToInsert.length} new metadata rows to insert (existing rows left untouched)\n`);

  if (rowsToInsert.length === 0) {
    console.log('✅ Nothing to do — all brand/market combinations already have metadata.');
    return;
  }

  if (dryRun) {
    console.log('🔎 Dry run — sample rows:');
    console.log(rowsToInsert.slice(0, 3));
    return;
  }

  const batchSize = 100;
  let inserted = 0;
  for (let i = 0; i < rowsToInsert.length; i += batchSize) {
    const batch = rowsToInsert.slice(i, i + batchSize);
    const { error } = await supabase.from('brand_metadata_locations').insert(batch);
    if (error) {
      console.error(`❌ Failed to insert batch starting at ${i}:`, error.message);
      continue;
    }
    inserted += batch.length;
    console.log(`  ✅ Inserted ${inserted}/${rowsToInsert.length}`);
  }

  console.log(`\n✨ Done! Inserted ${inserted} brand metadata rows.`);
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
