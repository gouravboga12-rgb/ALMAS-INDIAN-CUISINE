import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse .env if it exists to load database credentials
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

const DB_FILE = path.join(__dirname, 'database.json');

// Check if MySQL configuration is provided in env
const useMySQL = !!(process.env.DB_HOST || process.env.MYSQL_HOST);

let pool = null;

// Initial Default DB Structure for seeding
const defaultSettings = {
  timings: {
    mon_thu: "11AM - 10PM",
    fri_sat: "11AM - 11PM",
    sun: "12PM - 10PM"
  },
  marquee: "100% NATURAL AND FORM FRESH EVERY DAY • ALMAS THE QUALITY CHOICE • FREE DELIVERY ON ORDERS OVER $50 • GET 10% OFF ON YOUR FIRST ORDER USE CODE: ALMAS10 •",
  whatsapp: "+1 (416) 555-0199",
  socials: {
    instagram: "https://www.instagram.com/almas_toronto?igsh=MWhyOHVvaXV5dnI3OQ==",
    facebook: "https://www.facebook.com/share/1Gi1gSCyBM/",
    tiktok: "https://www.tiktok.com/@almas_indian_cuisine?_t=ZS-8tW2D9Zc9PZ&_r=1",
    google_page: "https://share.google/zXINa2CUdvGfRucFj",
    trip_advisor: "https://www.tripadvisor.com/Restaurant_Review-g155019-d34424580-Reviews-Almas_Indian_Cuisine-Toronto_Ontario.html"
  },
  delivery: {
    uber_eats: "https://www.ubereats.com/",
    doordash: "https://www.doordash.com/",
    skip: "https://www.skipthedishes.com/"
  }
};

const defaultServices = [
  {
    id: "catering",
    badge: "Grand Feasts",
    title: "Catering",
    description: "We offer customized catering for events and celebrations. From royal Hyderabadi biryanis and mandi to flavorful Lebanese grills and Indian classics, we bring a grand feast to your occasion.",
    image: "/catering_setup_premium_1776973042968.png",
    link: "/order.html?tab=catering",
    linkText: "Request Quote",
    order: 1
  },
  {
    id: "dine-in",
    badge: "The Experience",
    title: "Dine-In Experience",
    description: "Enjoy a warm and inviting atmosphere inspired by Hyderabadi hospitality, serving authentic Indian and Lebanese flavors. A perfect blend of tradition, comfort, and rich culinary heritage.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    link: "/contact.html",
    linkText: "Book a Table",
    order: 2
  },
  {
    id: "takeout",
    badge: "Convenience",
    title: "Takeout & Pickup",
    description: "Order your favorite Indian and Lebanese dishes with a Hyderabadi touch, freshly prepared and ready for pickup. Ideal for quick meals without compromising on authentic taste.",
    image: "/takeout.png",
    link: "/products.html",
    linkText: "Browse Our Menu",
    order: 3
  },
  {
    id: "party-dining",
    badge: "Gatherings",
    title: "Party & Group Dining",
    description: "Celebrate special moments with us in a setting inspired by Hyderabadi culture and warmth. Enjoy curated menus featuring the best of Indian and Lebanese cuisine for groups and gatherings.",
    image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=2070&auto=format&fit=crop",
    link: "/contact.html",
    linkText: "Plan Your Event",
    order: 4
  },
  {
    id: "online-delivery",
    badge: "To Your Door",
    title: "Online Ordering & Delivery",
    description: "Order easily through our website or delivery platforms. Experience the richness of Indian, Lebanese, and Hyderabadi-inspired dishes delivered fresh to your doorstep by Uber Eats, DoorDash, and SkipTheDishes.",
    image: "/delivery.png",
    link: "/order.html?tab=delivery",
    linkText: "Order Now",
    order: 5
  },
  {
    id: "live-catering",
    badge: "Interactive Feasting",
    title: "Live Catering",
    description: "Bring an interactive dining experience to your event with our live cooking setup. Our team prepares fresh food on-site, creating a vibrant atmosphere perfect for weddings, parties, and corporate gatherings.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
    link: "/order.html?tab=catering",
    linkText: "Book Experience",
    order: 6
  }
];

const defaultPackages = [
  {
    id: "royal-feast",
    name: "Royal Feast Package",
    badge: "20+ Guests",
    badgeBg: "#CC5500",
    price: 15.00,
    description: "Premium Biryani, 2 Appetizers, 1 Dessert, Raita & Salad."
  },
  {
    id: "imperial-feast",
    name: "Imperial Feast Package",
    badge: "40+ Guests",
    badgeBg: "#5C2E0B",
    price: 13.00,
    description: "Premium Biryani, Tandoori Platters, 2 Appetizers, 2 Desserts."
  },
  {
    id: "dynasty-grand",
    name: "Dynasty Grand Feast",
    badge: "60+ Guests",
    badgeBg: "#D4AF37",
    price: 11.00,
    description: "Mandi & Biryani, Unlimited Grills, 3 Appetizers, 2 Desserts, Drinks."
  },
  {
    id: "elite-custom",
    name: "Elite Custom Planner",
    badge: "Custom Range",
    badgeBg: "#1A1A1A",
    price: 18.00,
    description: "Custom size options. Completely customizable chef's table menu selection."
  }
];

// Load seed products from products-data.js dynamically
async function loadSeedProducts() {
  try {
    const { products: defaultProducts } = await import('./src/products-data.js');
    if (defaultProducts && Array.isArray(defaultProducts)) {
      const products = defaultProducts.map((p, idx) => ({
        ...p,
        id: p.id || `item-${idx + 1}`
      }));
      
      const uniqueCats = [...new Set(products.map(p => p.category))];
      const categories = uniqueCats.map((catName, index) => {
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

      return { products, categories };
    }
  } catch (err) {
    console.error("Error loading products-data.js for database seeding:", err);
  }
  return { products: [], categories: [] };
}

// ─── LOCAL FILE DATABASE FALLBACK IMPLEMENTATION ────────────────────────────────

function readJSONDB() {
  if (!fs.existsSync(DB_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error("Error reading JSON database:", err);
    return null;
  }
}

function writeJSONDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing JSON database:", err);
    return false;
  }
}

async function initJSONDB() {
  let db = readJSONDB();
  let updated = false;
  if (!db) {
    console.log("[DB] JSON Database not found. Seeding local database.json...");
    const { products, categories } = await loadSeedProducts();
    db = {
      categories,
      products,
      qr_categories: JSON.parse(JSON.stringify(categories)),
      qr_products: JSON.parse(JSON.stringify(products)),
      settings: defaultSettings,
      services: defaultServices,
      packages: defaultPackages,
      inquiries: [],
      users: []
    };
    updated = true;
  }
  if (db && !db.users) {
    db.users = [];
    updated = true;
  }
  if (db && !db.qr_categories) {
    db.qr_categories = JSON.parse(JSON.stringify(db.categories || []));
    updated = true;
  }
  if (db && !db.qr_products) {
    db.qr_products = JSON.parse(JSON.stringify(db.products || []));
    updated = true;
  }
  if (updated) {
    writeJSONDB(db);
  }
}

// ─── MYSQL DATABASE IMPLEMENTATION ───────────────────────────────────────────────

async function initMySQL() {
  const host = process.env.DB_HOST || process.env.MYSQL_HOST;
  const user = process.env.DB_USER || process.env.MYSQL_USER;
  let password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  if (password && typeof password === 'string') {
    password = password.replace(/\\\$/g, '$');
  }
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE;
  const port = parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306');

  console.log(`[DB] Attempting connection to MySQL Database [${database}] on ${host}:${port}...`);

  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test connection and run tables creation
  try {
    const conn = await pool.getConnection();
    console.log(`[DB] Connected successfully to MySQL! Running schema initialization...`);
    
    // 1. Categories table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(255) NOT NULL,
        order_num INT NOT NULL DEFAULT 0
      )
    `);

    // 2. Products table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        diet VARCHAR(255) NOT NULL,
        badge VARCHAR(255) NOT NULL,
        dietColor VARCHAR(255) NOT NULL,
        \`desc\` TEXT NOT NULL,
        spiceDefault VARCHAR(255) NOT NULL
      )
    `);

    // QR Categories table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS qr_categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(255) NOT NULL,
        order_num INT NOT NULL DEFAULT 0
      )
    `);

    // QR Products table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS qr_products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        diet VARCHAR(255) NOT NULL,
        badge VARCHAR(255) NOT NULL,
        dietColor VARCHAR(255) NOT NULL,
        \`desc\` TEXT NOT NULL,
        spiceDefault VARCHAR(255) NOT NULL
      )
    `);

    // 3. Settings table (Key/Value JSON)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(255) PRIMARY KEY,
        val TEXT NOT NULL
      )
    `);

    // 4. Services table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(255) PRIMARY KEY,
        badge VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        link VARCHAR(255) NOT NULL,
        linkText VARCHAR(255) NOT NULL,
        order_num INT NOT NULL DEFAULT 0
      )
    `);

    // 5. Packages table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        badge VARCHAR(255) NOT NULL,
        badgeBg VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL
      )
    `);

    // 6. Inquiries table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(255) NOT NULL,
        selectedPackage VARCHAR(255),
        guestCount INT,
        timestamp BIGINT NOT NULL,
        dateString VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL DEFAULT 'new'
      )
    `);

    // 7. Users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255),
        google_id VARCHAR(255),
        avatar VARCHAR(255),
        provider VARCHAR(50) NOT NULL DEFAULT 'email',
        created_at BIGINT NOT NULL,
        is_verified TINYINT(1) NOT NULL DEFAULT 0,
        otp_code VARCHAR(255) NULL,
        otp_expires BIGINT NULL,
        phone VARCHAR(50) NULL
      )
    `);

    // 8. Orders table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        type VARCHAR(100) NOT NULL,
        address VARCHAR(255) NOT NULL,
        time VARCHAR(100) NOT NULL,
        items TEXT NOT NULL,
        status VARCHAR(100) NOT NULL,
        payment VARCHAR(100) NOT NULL,
        tax DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        created_at BIGINT NOT NULL
      )
    `);

    // 9. Reviews table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(50) PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        comment TEXT NOT NULL,
        created_at BIGINT NOT NULL
      )
    `);

    // Run safe migrations for existing databases
    try {
      await conn.query("ALTER TABLE users ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 0");
    } catch (e) { /* already exists */ }
    try {
      await conn.query("ALTER TABLE users ADD COLUMN otp_code VARCHAR(255) NULL");
    } catch (e) { /* already exists */ }
    try {
      await conn.query("ALTER TABLE users ADD COLUMN otp_expires BIGINT NULL");
    } catch (e) { /* already exists */ }
    try {
      await conn.query("ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL");
    } catch (e) { /* already exists */ }

    conn.release();
    
    // Seed MySQL if tables are empty
    await seedMySQLIfNeeded();

  } catch (err) {
    console.error("[DB] MySQL connection/init failed. Falling back to local database.json!", err);
    pool = null; // deactivate pool
    await initJSONDB();
  }
}

async function seedMySQLIfNeeded() {
  try {
    // 1. Seed categories & products
    const [cats] = await pool.query("SELECT COUNT(*) as count FROM categories");
    if (cats[0].count === 0) {
      console.log("[DB] MySQL categories are empty. Seeding initial products & categories...");
      const { products, categories } = await loadSeedProducts();
      for (const cat of categories) {
        await pool.query(
          "INSERT INTO categories (id, name, icon, order_num) VALUES (?, ?, ?, ?)",
          [cat.id, cat.name, cat.icon, cat.order]
        );
      }
      for (const p of products) {
        await pool.query(
          "INSERT INTO products (id, name, price, image, category, diet, badge, dietColor, \`desc\`, spiceDefault) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [p.id, p.name, p.price, p.image, p.category, p.diet, p.badge || '', p.dietColor || '', p.desc || '', p.spiceDefault || 'Mild']
        );
      }
    }

    // 2. Seed settings
    const [settingsCount] = await pool.query("SELECT COUNT(*) as count FROM settings");
    if (settingsCount[0].count === 0) {
      console.log("[DB] MySQL settings are empty. Seeding settings...");
      await pool.query(
        "INSERT INTO settings (id, val) VALUES (?, ?)",
        ['global', JSON.stringify(defaultSettings)]
      );
    }

    // 3. Seed services
    const [servicesCount] = await pool.query("SELECT COUNT(*) as count FROM services");
    if (servicesCount[0].count === 0) {
      console.log("[DB] MySQL services are empty. Seeding services...");
      for (const s of defaultServices) {
        await pool.query(
          "INSERT INTO services (id, badge, title, description, image, link, linkText, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [s.id, s.badge, s.title, s.description, s.image, s.link, s.linkText, s.order]
        );
      }
    }

    // 4. Seed packages
    const [packagesCount] = await pool.query("SELECT COUNT(*) as count FROM packages");
    if (packagesCount[0].count === 0) {
      console.log("[DB] MySQL packages are empty. Seeding packages...");
      for (const pkg of defaultPackages) {
        await pool.query(
          "INSERT INTO packages (id, name, badge, badgeBg, price, description) VALUES (?, ?, ?, ?, ?, ?)",
          [pkg.id, pkg.name, pkg.badge, pkg.badgeBg, pkg.price, pkg.description]
        );
      }
    }

    // 5. Seed QR categories & products
    const [qrCats] = await pool.query("SELECT COUNT(*) as count FROM qr_categories");
    if (qrCats[0].count === 0) {
      console.log("[DB] MySQL qr_categories is empty. Seeding QR menu data...");
      const [stdCats] = await pool.query("SELECT * FROM categories");
      const [stdProds] = await pool.query("SELECT * FROM products");
      let catsToSeed = stdCats;
      let prodsToSeed = stdProds;

      if (catsToSeed.length === 0) {
        const seedData = await loadSeedProducts();
        catsToSeed = seedData.categories.map(c => ({ id: c.id, name: c.name, icon: c.icon, order_num: c.order }));
        prodsToSeed = seedData.products;
      }

      for (const cat of catsToSeed) {
        await pool.query(
          "INSERT INTO qr_categories (id, name, icon, order_num) VALUES (?, ?, ?, ?)",
          [cat.id, cat.name, cat.icon, cat.order_num !== undefined ? cat.order_num : cat.order]
        );
      }

      for (const p of prodsToSeed) {
        await pool.query(
          "INSERT INTO qr_products (id, name, price, image, category, diet, badge, dietColor, \`desc\`, spiceDefault) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [p.id, p.name, p.price, p.image, p.category, p.diet, p.badge || '', p.dietColor || '', p.desc || '', p.spiceDefault || 'Mild']
        );
      }
      console.log("[DB] MySQL QR Menu seeding complete!");
    }
  } catch (err) {
    console.error("[DB] Error seeding MySQL:", err);
  }
}

async function autoSyncDatabase() {
  try {
    const { products: seedProducts, categories: seedCategories } = await loadSeedProducts();
    if (!seedProducts || seedProducts.length === 0) return;

    console.log(`[DB] Auto-syncing database: checking ${seedProducts.length} products and ${seedCategories.length} categories...`);

    const existingMenu = await getMenu();
    const existingCategories = existingMenu.categories || [];
    const existingProducts = existingMenu.products || [];

    // Sync categories
    for (const cat of seedCategories) {
      const exists = existingCategories.find(c => c.id === cat.id);
      if (exists) {
        if (exists.name !== cat.name || exists.icon !== cat.icon || exists.order !== cat.order) {
          await updateCategory(cat.id, cat);
        }
      } else {
        console.log(`[DB] Auto-sync: Adding missing category ${cat.name}`);
        await addCategory(cat);
      }
    }

    // Sync products
    for (const prod of seedProducts) {
      const exists = existingProducts.find(p => p.id === prod.id);
      if (exists) {
        const isChanged = exists.name !== prod.name ||
                          exists.price !== prod.price ||
                          exists.image !== prod.image ||
                          exists.category !== prod.category ||
                          exists.diet !== prod.diet ||
                          exists.badge !== (prod.badge || '') ||
                          exists.dietColor !== (prod.dietColor || '') ||
                          exists.desc !== (prod.desc || '') ||
                          exists.spiceDefault !== (prod.spiceDefault || 'Mild');
        if (isChanged) {
          await updateProduct(prod.id, prod);
        }
      } else {
        console.log(`[DB] Auto-sync: Adding missing product ${prod.name}`);
        await addProduct(prod);
      }
    }
    console.log('[DB] Auto-sync complete!');
  } catch (err) {
    console.error('[DB] Auto-sync failed:', err);
  }
}

// ─── ADAPTER PUBLIC INTERFACE ───────────────────────────────────────────────────

export async function initializeDatabase() {
  if (useMySQL) {
    await initMySQL();
  } else {
    console.log("[DB] No MySQL environment variables detected. Using local database.json.");
    await initJSONDB();
  }
  await autoSyncDatabase();
}

// ─── GET ENTIRE MENU (Products & Categories)
export async function getMenu() {
  if (pool) {
    const [products] = await pool.query("SELECT * FROM products");
    const [categories] = await pool.query("SELECT * FROM categories ORDER BY order_num ASC");
    return {
      products,
      categories: categories.map(c => ({ id: c.id, name: c.name, icon: c.icon, order: c.order_num }))
    };
  } else {
    const db = readJSONDB();
    return { products: db.products || [], categories: db.categories || [] };
  }
}

// ─── PRODUCTS CRUD
export async function addProduct(p) {
  if (pool) {
    await pool.query(
      "INSERT INTO products (id, name, price, image, category, diet, badge, dietColor, \`desc\`, spiceDefault) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [p.id, p.name, p.price, p.image, p.category, p.diet, p.badge || '', p.dietColor || '', p.desc || '', p.spiceDefault || 'Mild']
    );
  } else {
    const db = readJSONDB();
    db.products.push(p);
    writeJSONDB(db);
  }
  return p;
}

export async function updateProduct(id, p) {
  if (pool) {
    await pool.query(
      "UPDATE products SET name=?, price=?, image=?, category=?, diet=?, badge=?, dietColor=?, \`desc\`=?, spiceDefault=? WHERE id=?",
      [p.name, p.price, p.image, p.category, p.diet, p.badge || '', p.dietColor || '', p.desc || '', p.spiceDefault || 'Mild', id]
    );
  } else {
    const db = readJSONDB();
    const idx = db.products.findIndex(prod => prod.id === id);
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...p, id };
      writeJSONDB(db);
    }
  }
  return { id, ...p };
}

export async function deleteProduct(id) {
  if (pool) {
    await pool.query("DELETE FROM products WHERE id=?", [id]);
  } else {
    const db = readJSONDB();
    db.products = db.products.filter(p => p.id !== id);
    writeJSONDB(db);
  }
}

// ─── CATEGORIES CRUD
export async function addCategory(c) {
  if (pool) {
    await pool.query(
      "INSERT INTO categories (id, name, icon, order_num) VALUES (?, ?, ?, ?)",
      [c.id, c.name, c.icon, c.order || 0]
    );
  } else {
    const db = readJSONDB();
    db.categories.push(c);
    writeJSONDB(db);
  }
  return c;
}

export async function updateCategory(id, c) {
  if (pool) {
    const [oldCat] = await pool.query("SELECT name FROM categories WHERE id=?", [id]);
    await pool.query(
      "UPDATE categories SET name=?, icon=?, order_num=? WHERE id=?",
      [c.name, c.icon, c.order || 0, id]
    );
    // Cascade update category name inside products
    if (oldCat.length > 0 && oldCat[0].name !== c.name) {
      await pool.query("UPDATE products SET category=? WHERE category=?", [c.name, oldCat[0].name]);
    }
  } else {
    const db = readJSONDB();
    const idx = db.categories.findIndex(cat => cat.id === id);
    if (idx !== -1) {
      const oldName = db.categories[idx].name;
      db.categories[idx] = { ...db.categories[idx], ...c, id };
      if (oldName !== c.name) {
        db.products = db.products.map(p => p.category === oldName ? { ...p, category: c.name } : p);
      }
      writeJSONDB(db);
    }
  }
  return { id, ...c };
}

export async function deleteCategory(id) {
  if (pool) {
    const [cat] = await pool.query("SELECT name FROM categories WHERE id=?", [id]);
    await pool.query("DELETE FROM categories WHERE id=?", [id]);
    if (cat.length > 0) {
      await pool.query("DELETE FROM products WHERE category=?", [cat[0].name]);
    }
  } else {
    const db = readJSONDB();
    const cat = db.categories.find(c => c.id === id);
    if (cat) {
      db.categories = db.categories.filter(c => c.id !== id);
      db.products = db.products.filter(p => p.category !== cat.name);
      writeJSONDB(db);
    }
  }
}

// ─── GET ENTIRE QR MENU (Products & Categories)
export async function getQRMenu() {
  if (pool) {
    const [products] = await pool.query("SELECT * FROM qr_products");
    const [categories] = await pool.query("SELECT * FROM qr_categories ORDER BY order_num ASC");
    return {
      products,
      categories: categories.map(c => ({ id: c.id, name: c.name, icon: c.icon, order: c.order_num }))
    };
  } else {
    const db = readJSONDB();
    return { products: db.qr_products || [], categories: db.qr_categories || [] };
  }
}

// ─── QR PRODUCTS CRUD
export async function addQRProduct(p) {
  if (pool) {
    await pool.query(
      "INSERT INTO qr_products (id, name, price, image, category, diet, badge, dietColor, \`desc\`, spiceDefault) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [p.id, p.name, p.price, p.image, p.category, p.diet, p.badge || '', p.dietColor || '', p.desc || '', p.spiceDefault || 'Mild']
    );
  } else {
    const db = readJSONDB();
    db.qr_products.push(p);
    writeJSONDB(db);
  }
  return p;
}

export async function updateQRProduct(id, p) {
  if (pool) {
    await pool.query(
      "UPDATE qr_products SET name=?, price=?, image=?, category=?, diet=?, badge=?, dietColor=?, \`desc\`=?, spiceDefault=? WHERE id=?",
      [p.name, p.price, p.image, p.category, p.diet, p.badge || '', p.dietColor || '', p.desc || '', p.spiceDefault || 'Mild', id]
    );
  } else {
    const db = readJSONDB();
    const idx = db.qr_products.findIndex(prod => prod.id === id);
    if (idx !== -1) {
      db.qr_products[idx] = { ...db.qr_products[idx], ...p, id };
      writeJSONDB(db);
    }
  }
  return { id, ...p };
}

export async function deleteQRProduct(id) {
  if (pool) {
    await pool.query("DELETE FROM qr_products WHERE id=?", [id]);
  } else {
    const db = readJSONDB();
    db.qr_products = db.qr_products.filter(p => p.id !== id);
    writeJSONDB(db);
  }
}

// ─── QR CATEGORIES CRUD
export async function addQRCategory(c) {
  if (pool) {
    await pool.query(
      "INSERT INTO qr_categories (id, name, icon, order_num) VALUES (?, ?, ?, ?)",
      [c.id, c.name, c.icon, c.order || 0]
    );
  } else {
    const db = readJSONDB();
    db.qr_categories.push(c);
    writeJSONDB(db);
  }
  return c;
}

export async function updateQRCategory(id, c) {
  if (pool) {
    const [oldCat] = await pool.query("SELECT name FROM qr_categories WHERE id=?", [id]);
    await pool.query(
      "UPDATE qr_categories SET name=?, icon=?, order_num=? WHERE id=?",
      [c.name, c.icon, c.order || 0, id]
    );
    // Cascade update category name inside qr_products
    if (oldCat.length > 0 && oldCat[0].name !== c.name) {
      await pool.query("UPDATE qr_products SET category=? WHERE category=?", [c.name, oldCat[0].name]);
    }
  } else {
    const db = readJSONDB();
    const idx = db.qr_categories.findIndex(cat => cat.id === id);
    if (idx !== -1) {
      const oldName = db.qr_categories[idx].name;
      db.qr_categories[idx] = { ...db.qr_categories[idx], ...c, id };
      if (oldName !== c.name) {
        db.qr_products = db.qr_products.map(p => p.category === oldName ? { ...p, category: c.name } : p);
      }
      writeJSONDB(db);
    }
  }
  return { id, ...c };
}

export async function deleteQRCategory(id) {
  if (pool) {
    const [cat] = await pool.query("SELECT name FROM qr_categories WHERE id=?", [id]);
    await pool.query("DELETE FROM qr_categories WHERE id=?", [id]);
    if (cat.length > 0) {
      await pool.query("DELETE FROM qr_products WHERE category=?", [cat[0].name]);
    }
  } else {
    const db = readJSONDB();
    const cat = db.qr_categories.find(c => c.id === id);
    if (cat) {
      db.qr_categories = db.qr_categories.filter(c => c.id !== id);
      db.qr_products = db.qr_products.filter(p => p.category !== cat.name);
      writeJSONDB(db);
    }
  }
}

// ─── SETTINGS
export async function getSettings() {
  if (pool) {
    const [rows] = await pool.query("SELECT val FROM settings WHERE id='global'");
    if (rows.length > 0) {
      return JSON.parse(rows[0].val);
    }
    return defaultSettings;
  } else {
    const db = readJSONDB();
    return db.settings || defaultSettings;
  }
}

export async function updateSettings(s) {
  if (pool) {
    const current = await getSettings();
    const updated = { ...current, ...s };
    await pool.query(
      "UPDATE settings SET val=? WHERE id='global'",
      [JSON.stringify(updated)]
    );
    return updated;
  } else {
    const db = readJSONDB();
    db.settings = { ...db.settings, ...s };
    writeJSONDB(db);
    return db.settings;
  }
}

// ─── SERVICES CRUD
export async function getServices() {
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM services ORDER BY order_num ASC");
    return rows.map(r => ({ ...r, order: r.order_num }));
  } else {
    const db = readJSONDB();
    return db.services || defaultServices;
  }
}

export async function addService(s) {
  if (pool) {
    await pool.query(
      "INSERT INTO services (id, badge, title, description, image, link, linkText, order_num) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [s.id, s.badge, s.title, s.description, s.image, s.link, s.linkText, s.order || 99]
    );
  } else {
    const db = readJSONDB();
    if (!db.services) db.services = [];
    db.services.push(s);
    db.services.sort((a, b) => (a.order || 99) - (b.order || 99));
    writeJSONDB(db);
  }
  return s;
}

export async function updateService(id, s) {
  if (pool) {
    await pool.query(
      "UPDATE services SET badge=?, title=?, description=?, image=?, link=?, linkText=?, order_num=? WHERE id=?",
      [s.badge, s.title, s.description, s.image, s.link, s.linkText, s.order || 99, id]
    );
  } else {
    const db = readJSONDB();
    const idx = db.services.findIndex(serv => serv.id === id);
    if (idx !== -1) {
      db.services[idx] = { ...db.services[idx], ...s, id };
      db.services.sort((a, b) => (a.order || 99) - (b.order || 99));
      writeJSONDB(db);
    }
  }
  return { id, ...s };
}

export async function deleteService(id) {
  if (pool) {
    await pool.query("DELETE FROM services WHERE id=?", [id]);
  } else {
    const db = readJSONDB();
    db.services = db.services.filter(s => s.id !== id);
    writeJSONDB(db);
  }
}

// ─── PACKAGES CRUD
export async function getPackages() {
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM packages");
    return rows.map(r => ({ ...r, price: parseFloat(r.price) }));
  } else {
    const db = readJSONDB();
    return db.packages || defaultPackages;
  }
}

export async function addPackage(pkg) {
  if (pool) {
    await pool.query(
      "INSERT INTO packages (id, name, badge, badgeBg, price, description) VALUES (?, ?, ?, ?, ?, ?)",
      [pkg.id, pkg.name, pkg.badge, pkg.badgeBg, pkg.price, pkg.description]
    );
  } else {
    const db = readJSONDB();
    if (!db.packages) db.packages = [];
    db.packages.push(pkg);
    writeJSONDB(db);
  }
  return pkg;
}

export async function updatePackage(id, pkg) {
  if (pool) {
    await pool.query(
      "UPDATE packages SET name=?, badge=?, badgeBg=?, price=?, description=? WHERE id=?",
      [pkg.name, pkg.badge, pkg.badgeBg, pkg.price, pkg.description, id]
    );
  } else {
    const db = readJSONDB();
    const idx = db.packages.findIndex(p => p.id === id);
    if (idx !== -1) {
      db.packages[idx] = { ...db.packages[idx], ...pkg, id };
      writeJSONDB(db);
    }
  }
  return { id, ...pkg };
}

export async function deletePackage(id) {
  if (pool) {
    await pool.query("DELETE FROM packages WHERE id=?", [id]);
  } else {
    const db = readJSONDB();
    db.packages = db.packages.filter(p => p.id !== id);
    writeJSONDB(db);
  }
}

// ─── INQUIRIES CRUD
export async function getInquiries() {
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM inquiries ORDER BY timestamp DESC");
    return rows;
  } else {
    const db = readJSONDB();
    return db.inquiries || [];
  }
}

export async function addInquiry(inq) {
  const newInq = {
    ...inq,
    id: inq.id || 'inq-' + Date.now() + '-' + Math.round(Math.random() * 1000),
    timestamp: Date.now(),
    dateString: new Date().toLocaleString(),
    status: 'new'
  };

  if (pool) {
    await pool.query(
      "INSERT INTO inquiries (id, name, phone, email, message, type, selectedPackage, guestCount, timestamp, dateString, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newInq.id, newInq.name, newInq.phone, newInq.email, newInq.message || '', newInq.type, newInq.selectedPackage || null, newInq.guestCount || null, newInq.timestamp, newInq.dateString, newInq.status]
    );
  } else {
    const db = readJSONDB();
    if (!db.inquiries) db.inquiries = [];
    db.inquiries.unshift(newInq);
    writeJSONDB(db);
  }
  return newInq;
}

export async function updateInquiryStatus(id, status) {
  if (pool) {
    await pool.query("UPDATE inquiries SET status=? WHERE id=?", [status, id]);
  } else {
    const db = readJSONDB();
    const idx = db.inquiries.findIndex(inq => inq.id === id);
    if (idx !== -1) {
      db.inquiries[idx].status = status;
      writeJSONDB(db);
    }
  }
}

export async function deleteInquiry(id) {
  if (pool) {
    await pool.query("DELETE FROM inquiries WHERE id=?", [id]);
  } else {
    const db = readJSONDB();
    db.inquiries = db.inquiries.filter(inq => inq.id !== id);
    writeJSONDB(db);
  }
}

// ─── USERS CRUD
export async function findUserByEmail(email) {
  if (!email) return null;
  const targetEmail = email.toLowerCase().trim();
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM users WHERE LOWER(email) = ?", [targetEmail]);
    return rows.length > 0 ? rows[0] : null;
  } else {
    const db = readJSONDB() || { users: [] };
    const users = db.users || [];
    return users.find(u => u.email && u.email.toLowerCase().trim() === targetEmail) || null;
  }
}

export async function findUserByGoogleId(googleId) {
  if (!googleId) return null;
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM users WHERE google_id = ?", [googleId]);
    return rows.length > 0 ? rows[0] : null;
  } else {
    const db = readJSONDB() || { users: [] };
    const users = db.users || [];
    return users.find(u => u.google_id === googleId) || null;
  }
}

export async function createUser(user) {
  const newUser = {
    id: user.id || 'usr-' + Date.now() + '-' + Math.round(Math.random() * 1000),
    name: user.name || '',
    email: (user.email || '').toLowerCase().trim(),
    password_hash: user.password_hash || null,
    google_id: user.google_id || null,
    avatar: user.avatar || null,
    provider: user.provider || 'email',
    created_at: Date.now(),
    is_verified: user.is_verified || 0,
    otp_code: user.otp_code || null,
    otp_expires: user.otp_expires || null,
    phone: user.phone || null
  };

  if (pool) {
    await pool.query(
      "INSERT INTO users (id, name, email, password_hash, google_id, avatar, provider, created_at, is_verified, otp_code, otp_expires, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newUser.id, newUser.name, newUser.email, newUser.password_hash, newUser.google_id, newUser.avatar, newUser.provider, newUser.created_at, newUser.is_verified, newUser.otp_code, newUser.otp_expires, newUser.phone]
    );
  } else {
    const db = readJSONDB();
    if (!db.users) db.users = [];
    db.users.push(newUser);
    writeJSONDB(db);
  }
  return newUser;
}

export async function getUserById(id) {
  if (!id) return null;
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  } else {
    const db = readJSONDB() || { users: [] };
    const users = db.users || [];
    return users.find(u => u.id === id) || null;
  }
}

export async function updateUser(id, updates) {
  if (!id) return null;
  if (pool) {
    const fields = [];
    const values = [];
    for (const [key, val] of Object.entries(updates)) {
      if (['name', 'email', 'password_hash', 'google_id', 'avatar', 'provider', 'is_verified', 'otp_code', 'otp_expires', 'phone'].includes(key)) {
        fields.push(`\`${key}\` = ?`);
        values.push(key === 'email' ? val.toLowerCase().trim() : val);
      }
    }
    if (fields.length === 0) return null;
    values.push(id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  } else {
    const db = readJSONDB();
    if (!db.users) db.users = [];
    const idx = db.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updates, id };
      writeJSONDB(db);
      return db.users[idx];
    }
    return null;
  }
}

// ─── ORDERS CRUD
export async function createOrder(order) {
  const newOrder = {
    id: order.id || 'ALM-' + Math.floor(10000 + Math.random() * 90000),
    user_id: order.user_id,
    name: order.name,
    email: order.email,
    phone: order.phone,
    type: order.type,
    address: order.address,
    time: order.time,
    items: typeof order.items === 'string' ? order.items : JSON.stringify(order.items),
    status: order.status,
    payment: order.payment,
    tax: parseFloat(order.tax || 0),
    total: parseFloat(order.total || 0),
    created_at: order.created_at || Date.now()
  };

  if (pool) {
    await pool.query(
      "INSERT INTO orders (id, user_id, name, email, phone, type, address, time, items, status, payment, tax, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [newOrder.id, newOrder.user_id, newOrder.name, newOrder.email, newOrder.phone, newOrder.type, newOrder.address, newOrder.time, newOrder.items, newOrder.status, newOrder.payment, newOrder.tax, newOrder.total, newOrder.created_at]
    );
  } else {
    const db = readJSONDB();
    if (!db.orders) db.orders = [];
    db.orders.unshift(newOrder);
    writeJSONDB(db);
  }
  return newOrder;
}

export async function getOrdersByUserId(userId) {
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
    return rows.map(r => ({ ...r, items: JSON.parse(r.items) }));
  } else {
    const db = readJSONDB() || { orders: [] };
    const list = db.orders || [];
    return list.filter(o => o.user_id === userId).map(o => ({ ...o, items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items }));
  }
}

export async function getAllOrders() {
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    return rows.map(r => ({ ...r, items: JSON.parse(r.items) }));
  } else {
    const db = readJSONDB() || { orders: [] };
    const list = db.orders || [];
    return list.map(o => ({ ...o, items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items }));
  }
}

export async function updateOrderStatus(id, status) {
  if (pool) {
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (rows.length > 0) {
      return { ...rows[0], items: JSON.parse(rows[0].items) };
    }
    return null;
  } else {
    const db = readJSONDB();
    if (!db.orders) db.orders = [];
    const idx = db.orders.findIndex(o => o.id === id);
    if (idx !== -1) {
      db.orders[idx].status = status;
      writeJSONDB(db);
      return db.orders[idx];
    }
    return null;
  }
}

// ─── REVIEWS CRUD
export async function createReview(review) {
  const newReview = {
    id: review.id || 'rev-' + Date.now() + '-' + Math.round(Math.random() * 1000),
    product_id: review.product_id,
    user_id: review.user_id,
    name: review.name,
    rating: parseInt(review.rating || 5),
    comment: review.comment,
    created_at: review.created_at || Date.now()
  };

  if (pool) {
    await pool.query(
      "INSERT INTO reviews (id, product_id, user_id, name, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [newReview.id, newReview.product_id, newReview.user_id, newReview.name, newReview.rating, newReview.comment, newReview.created_at]
    );
  } else {
    const db = readJSONDB();
    if (!db.reviews) db.reviews = [];
    db.reviews.unshift(newReview);
    writeJSONDB(db);
  }
  return newReview;
}

export async function getReviewsByProductId(productId) {
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC", [productId]);
    return rows;
  } else {
    const db = readJSONDB() || { reviews: [] };
    const list = db.reviews || [];
    return list.filter(r => r.product_id === productId);
  }
}

export async function getReviewById(id) {
  if (pool) {
    const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  } else {
    const db = readJSONDB() || { reviews: [] };
    const list = db.reviews || [];
    return list.find(r => r.id === id) || null;
  }
}

export async function updateReview(id, updates) {
  if (pool) {
    const fields = [];
    const values = [];
    for (const [key, val] of Object.entries(updates)) {
      if (['rating', 'comment'].includes(key)) {
        fields.push(`\`${key}\` = ?`);
        values.push(val);
      }
    }
    if (fields.length === 0) return null;
    values.push(id);
    await pool.query(`UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`, values);
    const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [id]);
    return rows[0] || null;
  } else {
    const db = readJSONDB();
    if (!db.reviews) db.reviews = [];
    const idx = db.reviews.findIndex(r => r.id === id);
    if (idx !== -1) {
      db.reviews[idx] = { ...db.reviews[idx], ...updates, id };
      writeJSONDB(db);
      return db.reviews[idx];
    }
    return null;
  }
}

export async function deleteReview(id) {
  if (pool) {
    await pool.query("DELETE FROM reviews WHERE id = ?", [id]);
  } else {
    const db = readJSONDB();
    if (!db.reviews) db.reviews = [];
    db.reviews = db.reviews.filter(r => r.id !== id);
    writeJSONDB(db);
  }
  return true;
}

// ─── CUSTOMERS LIST (Admin Dashboard)
export async function getCustomersList() {
  if (pool) {
    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        COALESCE(u.phone, (SELECT o.phone FROM orders o WHERE o.user_id = u.id ORDER BY o.created_at DESC LIMIT 1)) as phone,
        u.created_at,
        (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as orders_count
      FROM users u
      ORDER BY u.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  } else {
    const db = readJSONDB() || { users: [], orders: [] };
    const users = db.users || [];
    const orders = db.orders || [];
    
    return users.map(u => {
      const userOrders = orders.filter(o => o.user_id === u.id);
      const latestOrder = userOrders[0];
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || (latestOrder ? latestOrder.phone : null),
        created_at: u.created_at,
        orders_count: userOrders.length
      };
    }).sort((a, b) => b.created_at - a.created_at);
  }
}

export async function deleteCustomer(id) {
  if (pool) {
    await pool.query("DELETE FROM users WHERE id=?", [id]);
  } else {
    const db = readJSONDB();
    if (db.users) {
      db.users = db.users.filter(u => u.id !== id);
      writeJSONDB(db);
    }
  }
}
