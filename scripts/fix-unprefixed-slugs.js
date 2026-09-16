#!/usr/bin/env node

/**
 * One-off fix: 24 recently-added products were given slugs without the
 * brand-name prefix that the rest of the catalog (518 products) uses,
 * which is why brand-subcategory / product URLs looked inconsistent on
 * the first two pages of listings. Prefixes each with its brand slug and
 * prints the old->new mapping so it can be pasted into next.config.ts redirects.
 *
 * Usage:
 *   node scripts/fix-unprefixed-slugs.js --dry-run
 *   node scripts/fix-unprefixed-slugs.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const dryRun = process.argv.includes('--dry-run');

async function main() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, brand:brands(slug)')
    .eq('active', true);

  if (error) {
    console.error('❌ Failed to fetch products:', error.message);
    process.exit(1);
  }

  const { data: allSlugRows } = await supabase.from('products').select('slug');
  const slugSet = new Set(allSlugRows.map((p) => p.slug));

  const unprefixed = products.filter((p) => {
    const brandSlug = p.brand && typeof p.brand === 'object' ? p.brand.slug : null;
    return brandSlug && p.slug && !p.slug.startsWith(brandSlug + '-');
  });

  if (unprefixed.length === 0) {
    console.log('✅ No unprefixed slugs found.');
    return;
  }

  console.log(`📝 Found ${unprefixed.length} products with unprefixed slugs\n`);

  const updates = [];
  for (const p of unprefixed) {
    const brandSlug = p.brand.slug;
    const newSlug = `${brandSlug}-${p.slug}`;
    if (slugSet.has(newSlug)) {
      console.error(`⚠️  Skipping id ${p.id}: "${newSlug}" already exists (collision)`);
      continue;
    }
    updates.push({ id: p.id, oldSlug: p.slug, newSlug });
  }

  console.log('Old → New:');
  for (const u of updates) console.log(`  ${u.oldSlug}  →  ${u.newSlug}`);

  console.log('\nnext.config.ts redirect entries:');
  console.log(
    updates
      .map(
        (u) =>
          `      { source: "/${u.oldSlug}", destination: "/${u.newSlug}", permanent: true },`,
      )
      .join('\n'),
  );

  if (dryRun) {
    console.log('\n🔎 Dry run — no changes written.');
    return;
  }

  let updated = 0;
  for (const u of updates) {
    const { error: updateError } = await supabase
      .from('products')
      .update({ slug: u.newSlug })
      .eq('id', u.id);
    if (updateError) {
      console.error(`❌ Failed to update id ${u.id}:`, updateError.message);
      continue;
    }
    updated++;
  }

  console.log(`\n✨ Updated ${updated}/${updates.length} product slugs.`);
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
