#!/usr/bin/env node

/**
 * SEO Report Script - Multi-Country Version
 * Shows metadata completion status across countries and languages
 * 
 * Usage: 
 *   node scripts/seo-report.js [limit] [country_code]
 * Examples:
 *   node scripts/seo-report.js              # Show all countries
 *   node scripts/seo-report.js 50           # Show 50 products, all countries
 *   node scripts/seo-report.js 50 AE        # Show 50 products, UAE only
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateReport() {
  try {
    const limit = parseInt(process.argv[2]) || 50;
    const countryFilter = process.argv[3] ? process.argv[3].toUpperCase() : null;

    console.log('📊 SEO Metadata Report - Multi-Country\n');

    // Fetch countries
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('code, name');

    if (countriesError) throw countriesError;

    const filteredCountries = countryFilter
      ? countries.filter(c => c.code === countryFilter)
      : countries;

    if (filteredCountries.length === 0) {
      console.log(`❌ No countries found with code: ${countryFilter}`);
      return;
    }

    console.log(`🌍 Reporting on: ${filteredCountries.map(c => `${c.code} (${c.name})`).join(', ')}\n`);

    // Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name_en, name_ar')
      .limit(limit);

    if (productsError) throw productsError;

    if (!products || products.length === 0) {
      console.log('❌ No products found');
      return;
    }

    console.log(`📋 Top ${products.length} Products\n`);

    // For each country and language
    for (const country of filteredCountries) {
      console.log(`\n🌏 ${country.code} - ${country.name}`);
      console.log('─'.repeat(80));

      for (const language of ['en', 'ar']) {
        const langName = language === 'en' ? 'English' : 'العربية';
        console.log(`\n  ${language.toUpperCase()} (${langName})`);
        
        // Fetch metadata for this country/language
        const { data: metadata, error: metadataError } = await supabase
          .from('product_metadata_locations')
          .select('product_id, meta_title, meta_description, meta_keywords')
          .eq('country_code', country.code)
          .eq('language', language);

        if (metadataError) {
          console.log(`    ⚠️  Error fetching metadata: ${metadataError.message}`);
          continue;
        }

        const metadataMap = new Map(metadata?.map(m => [m.product_id, m]) || []);

        let complete = 0;
        let partial = 0;
        let missing = 0;

        products.forEach(product => {
          const meta = metadataMap.get(product.id);
          if (!meta) {
            missing++;
          } else if (meta.meta_title && meta.meta_description && meta.meta_keywords) {
            complete++;
          } else {
            partial++;
          }
        });

        const percentage = ((complete / products.length) * 100).toFixed(1);
        console.log(`    ✅ Complete: ${complete}/${products.length} (${percentage}%)`);
        console.log(`    ⚠️  Partial: ${partial}`);
        console.log(`    ❌ Missing: ${missing}`);
      }
    }

    // Overall summary
    console.log('\n\n📈 Summary');
    console.log('─'.repeat(80));
    console.log('To generate metadata:');
    console.log(`  node scripts/generate-seo-metadata.js              # All countries`);
    console.log(`  node scripts/generate-seo-metadata.js --country AE # UAE only`);
    console.log('\nTo manually edit:');
    console.log(`  node scripts/edit-seo-metadata.js <id> <country> [lang]`);
    console.log(`  Example: node scripts/edit-seo-metadata.js 5 AE ar`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateReport();
