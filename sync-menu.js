import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Parse .env if it exists to load database credentials
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

// Import database methods
import {
  initializeDatabase,
  getMenu,
  addProduct,
  updateProduct,
  addCategory,
  updateCategory
} from './db.js';

// Derive seed data
async function loadSeedData() {
  const { products: defaultProducts } = await import('./src/products-data.js');
  if (!defaultProducts || !Array.isArray(defaultProducts)) {
    throw new Error('Could not load products array from products-data.js');
  }

  const seedProducts = defaultProducts.map((p, idx) => ({
    ...p,
    id: p.id || `item-${idx + 1}`
  }));

  const uniqueCats = [...new Set(seedProducts.map(p => p.category))];
  const seedCategories = uniqueCats.map((catName, index) => {
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let icon = '🍽️';
    if (slug.includes('soup')) icon = '🍲';
    else if (slug.includes('appetizer')) icon = '🍢';
    else if (slug.includes('tandoor')) icon = '🍢';
    else if (slug.includes('main')) icon = '🍛';
    else if (slug.includes('biryani')) icon = '🍛';
    else if (slug.includes('mandi')) icon = '🍛';
    else if (slug.includes('pulao')) icon = '🍲';
    else if (slug.includes('chinese')) icon = '🥢';
    else if (slug.includes('momo')) icon = '🥟';
    else if (slug.includes('bread')) icon = '🫓';
    else if (slug.includes('dessert')) icon = '🍰';
    else if (slug.includes('beverage') || slug.includes('drink')) icon = '🥤';

    return {
      id: slug,
      name: catName,
      icon: icon,
      order: index + 1
    };
  });

  return { seedProducts, seedCategories };
}

async function runSync() {
  console.log('=== Database Synchronization Tool ===');
  
  // 1. Initialize Database Adapter
  await initializeDatabase();

  // 2. Load Seed Data from products-data.js
  const { seedProducts, seedCategories } = await loadSeedData();
  console.log(`Loaded ${seedProducts.length} products and ${seedCategories.length} categories from products-data.js`);

  // 3. Fetch Existing DB menu
  const existingMenu = await getMenu();
  const existingCategories = existingMenu.categories || [];
  const existingProducts = existingMenu.products || [];

  console.log(`Current DB contains ${existingProducts.length} products and ${existingCategories.length} categories`);

  // 4. Sync Categories (Upsert)
  console.log('\n--- Syncing Categories ---');
  for (const cat of seedCategories) {
    const exists = existingCategories.find(c => c.id === cat.id);
    if (exists) {
      console.log(`Updating category: ${cat.name} (${cat.id})`);
      await updateCategory(cat.id, cat);
    } else {
      console.log(`Adding new category: ${cat.name} (${cat.id})`);
      await addCategory(cat);
    }
  }

  // 5. Sync Products (Upsert)
  console.log('\n--- Syncing Products ---');
  for (const prod of seedProducts) {
    const exists = existingProducts.find(p => p.id === prod.id);
    if (exists) {
      console.log(`Updating product: ${prod.name} (${prod.id})`);
      await updateProduct(prod.id, prod);
    } else {
      console.log(`Adding new product: ${prod.name} (${prod.id})`);
      await addProduct(prod);
    }
  }

  console.log('\n=== Database synchronization completed successfully! ===');
  process.exit(0);
}

runSync().catch(err => {
  console.error('\n!!! Sync Error:', err);
  process.exit(1);
});
