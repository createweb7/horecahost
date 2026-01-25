#!/usr/bin/env node

/**
 * SEO Metadata Generator Script - Multi-Country Version
 * Generates meta_title, meta_description, and meta_keywords for all products
 * Supports multiple countries and languages
 * 
 * Usage: 
 *   node scripts/generate-seo-metadata.js              # Generate for all countries/languages
 *   node scripts/generate-seo-metadata.js --country AE # Generate only for UAE
 *   node scripts/generate-seo-metadata.js --country SA --language ar # Saudi Arabia Arabic
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Parse command line arguments
const args = process.argv.slice(2);
const countryFilter = args.includes('--country') ? args[args.indexOf('--country') + 1] : null;
const languageFilter = args.includes('--language') ? args[args.indexOf('--language') + 1] : null;

// Country-specific location names for more localized SEO
const locationNames = {
  'AE': { en: 'Dubai', ar: 'دبي' },
  'SA': { en: 'Riyadh', ar: 'الرياض' },
  'QA': { en: 'Doha', ar: 'الدوحة' },
  'KW': { en: 'Kuwait City', ar: 'مدينة الكويت' },
  'BH': { en: 'Manama', ar: 'المنامة' },
  'OM': { en: 'Muscat', ar: 'مسقط' },
};

// Template variations for English
const titleTemplates = {
  en: [
    (name, subcat, brand, location) => `Buy Premium ${name} ${subcat} by ${brand} in ${location} | HorecaHost`,
    (name, subcat, brand, location) => `${name} - Best ${subcat} in ${location} | ${brand} Supplier`,
    (name, subcat, brand, location) => `${brand} ${name} ${subcat} in ${location} | Professional Quality`,
    (name, subcat, brand, location) => `Best Quality ${name} ${subcat} | ${brand} ${location}`,
    (name, subcat, brand, location) => `${name} ${subcat} for Professional Kitchens | ${brand} ${location}`,
  ],
  ar: [
    (name, subcat, brand, location) => `شراء ${name} ${subcat} من ${brand} في ${location} | HorecaHost`,
    (name, subcat, brand, location) => `${name} - أفضل ${subcat} في ${location} | ${brand}`,
    (name, subcat, brand, location) => `${name} ${subcat} احترافي من ${brand} في ${location}`,
    (name, subcat, brand, location) => `${name} ${subcat} عالي الجودة | ${brand} ${location}`,
    (name, subcat, brand, location) => `${name} ${subcat} للمطابخ المهنية | ${brand} ${location}`,
  ]
};

const descriptionTemplates = {
  en: [
    (name, subcat, brand, location) => 
      `Explore the ${name} ${subcat} by ${brand} in ${location}. Designed for efficient quality with advanced features and reliable performance.`,
    (name, subcat, brand, location) => 
      `Discover premium ${name} ${subcat} by ${brand} in ${location}. Perfect for professional kitchens and restaurants. Shop now for best prices.`,
    (name, subcat, brand, location) => 
      `Buy high-quality ${name} ${subcat} from ${brand} in ${location}. Trusted by restaurants and cafes for durability and efficiency.`,
    (name, subcat, brand, location) => 
      `Looking for reliable ${name} ${subcat}? HorecaHost offers premium ${brand} equipment in ${location} with excellent customer support.`,
    (name, subcat, brand, location) => 
      `Professional ${name} ${subcat} by ${brand} for ${location} restaurants. Energy-efficient, durable, and designed for commercial kitchens.`,
  ],
  ar: [
    (name, subcat, brand, location) => 
      `اكتشف ${name} ${subcat} من ${brand} في ${location}. مصمم لكفاءة عالية مع ميزات متقدمة وأداء موثوق.`,
    (name, subcat, brand, location) => 
      `اكتشف ${name} ${subcat} من ${brand} في ${location}. مثالي للمطابخ المهنية والمطاعم. تسوق الآن بأفضل الأسعار.`,
    (name, subcat, brand, location) => 
      `اشتر ${name} ${subcat} عالي الجودة من ${brand} في ${location}. موثوق به من قبل المطاعم والمقاهي للمتانة والكفاءة.`,
    (name, subcat, brand, location) => 
      `تبحث عن ${name} ${subcat} موثوق؟ توفر HorecaHost معدات ${brand} الممتازة في ${location} مع دعم عملاء ممتاز.`,
    (name, subcat, brand, location) => 
      `${name} ${subcat} احترافي من ${brand} لمطاعم ${location}. موفر للطاقة ومتين ومصمم للمطابخ التجارية.`,
  ]
};

const keywordTemplates = {
  en: [
    (name, subcat, brand, category, location) => 
      `${name}, ${subcat}, ${brand}, ${location}, restaurant equipment, commercial kitchen, ${category}`,
    (name, subcat, brand, category, location) => 
      `buy ${subcat}, ${brand} ${name}, ${location} restaurant supplies, professional kitchen equipment, ${category}`,
    (name, subcat, brand, category, location) => 
      `${name} ${location}, premium ${subcat}, ${brand} equipment, restaurant kitchen, ${category} supplier`,
  ],
  ar: [
    (name, subcat, brand, category, location) => 
      `${name}, ${subcat}, ${brand}, ${location}, معدات مطاعم, مطبخ تجاري, ${category}`,
    (name, subcat, brand, category, location) => 
      `شراء ${subcat}, ${brand} ${name}, مستلزمات مطاعم ${location}, معدات مطبخ احترافية, ${category}`,
    (name, subcat, brand, category, location) => 
      `${name} ${location}, ${subcat} احترافي, معدات ${brand}, مطبخ مطعم, ${category}`,
  ]
};

async function generateSEOMetadata() {
  try {
    console.log('🚀 Starting multi-country SEO metadata generation...\n');

    // Fetch all countries
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('id, code, name');

    if (countriesError) throw countriesError;

    const filteredCountries = countryFilter 
      ? countries.filter(c => c.code === countryFilter.toUpperCase())
      : countries;

    if (filteredCountries.length === 0) {
      console.log(`❌ No countries found with code: ${countryFilter}`);
      return;
    }

    // Fetch all products
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select(`
        id,
        name_en,
        name_ar,
        category_id,
        subcategory_id,
        brand_id,
        categories(name_en, name_ar),
        subcategories(name_en, name_ar),
        brands(name_en, name_ar)
      `);

    if (fetchError) throw fetchError;

    if (!products || products.length === 0) {
      console.log('❌ No products found');
      return;
    }

    console.log(`📊 Found ${products.length} products`);
    console.log(`🌍 Processing ${filteredCountries.length} countries`);
    const languages = languageFilter ? [languageFilter] : ['en', 'ar'];
    console.log(`🗣️  Processing ${languages.length} languages: ${languages.join(', ')}\n`);

    let totalInserted = 0;
    let failed = 0;
    const batchSize = 10;

    // Process each country and language combination
    for (const country of filteredCountries) {
      const locationName = locationNames[country.code] || { en: country.name, ar: country.name };
      
      console.log(`\n🌏 Processing ${country.code} (${country.name})`);
      console.log('─'.repeat(50));

      for (const lang of languages) {
        console.log(`  📝 Language: ${lang}`);
        let countryLangInserted = 0;

        // Process products in batches
        for (let i = 0; i < products.length; i += batchSize) {
          const batch = products.slice(i, i + batchSize);
          const inserts = [];

          for (const product of batch) {
            const name = lang === 'en' ? (product.name_en || 'Product') : (product.name_ar || 'منتج');
            const subcat = lang === 'en' 
              ? (product.subcategories?.name_en || 'Equipment')
              : (product.subcategories?.name_ar || 'معدات');
            const brand = lang === 'en'
              ? (product.brands?.name_en || 'Premium')
              : (product.brands?.name_ar || 'برميوم');
            const category = lang === 'en'
              ? (product.categories?.name_en || 'Restaurant Equipment')
              : (product.categories?.name_ar || 'معدات المطاعم');
            const location = locationName[lang];

            // Select template variation based on product ID
            const titleIndex = product.id % titleTemplates[lang].length;
            const descIndex = product.id % descriptionTemplates[lang].length;
            const keywordIndex = product.id % keywordTemplates[lang].length;

            const meta_title = titleTemplates[lang][titleIndex](name, subcat, brand, location).substring(0, 255);
            const meta_description = descriptionTemplates[lang][descIndex](name, subcat, brand, location);
            const meta_keywords = keywordTemplates[lang][keywordIndex](name, subcat, brand, category, location);

            inserts.push({
              product_id: product.id,
              country_code: country.code,
              language: lang,
              meta_title,
              meta_description,
              meta_keywords,
            });
          }

          // Batch insert with upsert (update if exists)
          for (const insert of inserts) {
            const { error } = await supabase
              .from('product_metadata_locations')
              .upsert(insert, {
                onConflict: 'product_id,country_code,language'
              });

            if (error) {
              console.log(`    ❌ Product ${insert.product_id}: ${error.message}`);
              failed++;
            } else {
              totalInserted++;
              countryLangInserted++;
            }
          }
        }

        console.log(`    ✅ Inserted ${countryLangInserted} metadata entries`);
      }
    }

    console.log(`\n\n✨ Completed!`);
    console.log(`✅ Total inserted: ${totalInserted}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`\n📝 Next steps:`);
    console.log(`1. Generate for other countries: node scripts/generate-seo-metadata.js --country SA`);
    console.log(`2. Review the generated metadata in Supabase`);
    console.log(`3. Manually edit top products for uniqueness`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateSEOMetadata();
