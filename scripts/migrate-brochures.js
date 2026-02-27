/**
 * Script to migrate brochures from MySQL backup to Supabase PostgreSQL
 *
 * USAGE:
 * 1. Before running: Create the brochures table in Supabase
 * 2. Map old MySQL product IDs to new product IDs
 * 3. Ensure brochures exist in /public/brochure directory
 */

const fs = require("fs");
const path = require("path");

// Sample brochure data extracted from brochure.sql
// Note: section_id in old table is the product_id in new table
const broChureData = [
  { section_id: 374, filename: "post_55130_374.pdf" }, // Old product ID: 374
  { section_id: 374, filename: "post_32100_374.pdf" },
  { section_id: 373, filename: "post_36120_373.pdf" }, // Old product ID: 373
  { section_id: 372, filename: "post_46220_372.pdf" }, // Old product ID: 372
  { section_id: 368, filename: "post_18120_368.pdf" }, // Old product ID: 368
  { section_id: 378, filename: "post_28280_378.pdf" }, // Old product ID: 378
  { section_id: 379, filename: "post_35150_379.pdf" }, // Old product ID: 379
  { section_id: 380, filename: "post_41290_380.pdf" }, // Old product ID: 380
  { section_id: 381, filename: "post_53280_381.pdf" }, // Old product ID: 381
  { section_id: 382, filename: "post_58540_382.pdf" }, // Old product ID: 382
  // Add more as needed from brochure.sql
];

/**
 * Step 1: Map OLD section_id values to NEW product_id values
 * section_id from MySQL assets_brochure table → product_id in Supabase products table
 *
 * IMPORTANT: These keys (374, 373, 372, etc.) are from the old MySQL database.
 * Initialize them by querying your products table to find which old products exist in new database.
 *
 * Created by: Database admin
 * Edit this mapping based on your products table
 */
const productIdMapping = {
  374: null, // TODO: Map old section_id 374 to new product_id
  373: null, // TODO: Map old section_id 373 to new product_id
  372: null, // TODO: Map old section_id 372 to new product_id
  368: null, // TODO: Map old section_id 368 to new product_id
  378: null, // TODO: Map old section_id 378 to new product_id
  379: null, // TODO: Map old section_id 379 to new product_id
  380: null, // TODO: Map old section_id 380 to new product_id
  381: null, // TODO: Map old section_id 381 to new product_id
  382: null, // TODO: Map old section_id 382 to new product_id
  // Add more mappings as needed
};

/**
 * Step 2: Validate brochure files exist in /public/brochure
 */
function validateBrochureFiles() {
  const brochurePath = path.join(process.cwd(), "public", "brochure");

  if (!fs.existsSync(brochurePath)) {
    console.error(`Brochure directory not found: ${brochurePath}`);
    return false;
  }

  const files = fs.readdirSync(brochurePath);
  console.log(`Found ${files.length} files in brochure directory`);
  console.log("Sample files:", files.slice(0, 5));

  return true;
}

/**
 * Step 3: Generate INSERT statement for Supabase
 */
function generateInsertStatements() {
  const insertStatements = [];
  let skipped = 0;
  let inserted = 0;

  broChureData.forEach((item, index) => {
    // item.section_id is the old MySQL product ID
    const newProductId = productIdMapping[item.section_id];

    if (!newProductId) {
      console.warn(
        `Skipping: No mapping for old section_id ${item.section_id} → ${item.filename}`,
      );
      skipped++;
      return;
    }
    inserted++;

    const isMain = index === 0; // First brochure is main for each product
    const filePath = `/brochure/${item.filename}`;

    const sql = `INSERT INTO brochures (product_id, filename, file_path, is_main, active) 
      VALUES (${newProductId}, '${item.filename}', '${filePath}', ${isMain}, true);`;

    insertStatements.push(sql);
  });

  return insertStatements;
}

// Main execution
console.log("=== Brochure Migration Helper ===\n");
console.log("\nMapping: Old MySQL section_id → New Supabase product_id\n");

if (validateBrochureFiles()) {
  console.log("\n✅ Brochure directory validated\n");

  // Display the mapping needed
  console.log(
    "REQUIRED: Edit scripts/product-id-mapping.json with actual product IDs",
  );
  console.log("Old section_id values to map:", Object.keys(productIdMapping));
  console.log(
    "\nAfter mapping, you can generate SQL with: generateInsertStatements()",
  );
}

console.log("\n=== Instructions ===");
console.log(
  "1. Edit the productIdMapping object to map old to new product IDs",
);
console.log("2. Run in Node.js or browser console: generateInsertStatements()");
console.log("3. Copy the SQL statements and paste into Supabase SQL editor");
console.log(
  "4. Verify all brochures are in /public/brochure with correct filenames\n",
);

module.exports = {
  validateBrochureFiles,
  generateInsertStatements,
  broChureData,
  productIdMapping,
};
