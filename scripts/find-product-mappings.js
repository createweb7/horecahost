#!/usr/bin/env node

/**
 * Helper script to generate product ID mappings
 *
 * This script helps you find which old section_ids map to new product_ids
 * by matching product names or slugs
 *
 * Usage: node scripts/find-product-mappings.js
 */

const fs = require("fs");
const path = require("path");

// Sample data structure from old MySQL database
// Format: { old_section_id, product_name_en (if available) }
const OLD_PRODUCTS = {
  374: "Blender",
  373: "Mixer",
  372: "Processor",
  368: "Fryer",
  378: "Warmer",
  379: "Cooker",
  380: "Oven",
  381: "Steamer",
  382: "Grill",
  383: "Broiler",
  384: "Range",
  385: "Hood",
  // Add or update with actual old product names
};

console.log("=== Product ID Mapping Helper ===\n");

console.log("STEP 1: Query your Supabase products table");
console.log("---");
console.log(`
SELECT id, name_en, slug FROM products ORDER BY id;

Copy the full result and paste below to auto-generate mappings.
`);

console.log("\nOLD PRODUCTS TO FIND (from assets_brochure):");
console.log("==========================================");

Object.entries(OLD_PRODUCTS).forEach(([sectionId, productName]) => {
  console.log(`  ${sectionId}: ${productName}`);
});

console.log("\n\nSTEP 2: Update product-id-mapping.json");
console.log("======================================");
console.log(`
After getting the product list from Supabase, look for matches and update:
scripts/product-id-mapping.json

Example:
{
  "374": 15,    // Found "Blender" with id 15
  "373": 22,    // Found "Mixer" with id 22
  ...
}
`);

console.log("\nSTEP 3: Verify the mapping");
console.log("==========================");
console.log(`
Run: node scripts/migrate-brochures.js

This will validate files and show you the INSERT statements ready to use.
`);

console.log("\nDEBUG: Current mapping file content:");
console.log("====================================");

try {
  const mappingFile = path.join(__dirname, "product-id-mapping.json");
  if (fs.existsSync(mappingFile)) {
    const mapping = JSON.parse(fs.readFileSync(mappingFile, "utf-8"));
    const mapped = Object.entries(mapping).filter(
      ([_, value]) => value !== null && value !== "_comment",
    );
    const unmapped = Object.entries(mapping).filter(
      ([key, value]) => value === null && key !== "_comment",
    );

    console.log(`\nMapped: ${mapped.length} items`);
    mapped.forEach(([sectionId, productId]) => {
      console.log(`  ${sectionId} \u2192 ${productId}`);
    });

    console.log(`\nUnmapped: ${unmapped.length} items (TODO)`);
    if (unmapped.length <= 20) {
      unmapped.forEach(([sectionId]) => {
        const name = OLD_PRODUCTS[sectionId] || "Unknown";
        console.log(`  ${sectionId}: ${name}`);
      });
    } else {
      unmapped.slice(0, 10).forEach(([sectionId]) => {
        const name = OLD_PRODUCTS[sectionId] || "Unknown";
        console.log(`  ${sectionId}: ${name}`);
      });
      console.log(`  ... and ${unmapped.length - 10} more`);
    }
  }
} catch (error) {
  console.error("Error reading mapping file:", error.message);
}
