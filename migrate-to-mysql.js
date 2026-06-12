import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file if it exists
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

async function migrate() {
  if (!fs.existsSync(DB_FILE)) {
    console.error(`[MIGRATION] database.json not found at ${DB_FILE}`);
    process.exit(1);
  }

  const host = process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost';
  const user = process.env.DB_USER || process.env.MYSQL_USER;
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD;
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE;
  const port = parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306');

  if (!user || !password || !database) {
    console.error("[MIGRATION] Missing database environment variables (DB_USER, DB_PASSWORD, DB_NAME).");
    process.exit(1);
  }

  console.log(`[MIGRATION] Connecting to MySQL database [${database}] on ${host}:${port}...`);
  let connection;
  try {
    connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port
    });
    console.log("[MIGRATION] Connected successfully to MySQL!");
    
    // Schema Initialization
    console.log("[MIGRATION] Initializing tables if they do not exist...");
    
    // 1. Categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(255) NOT NULL,
        order_num INT NOT NULL DEFAULT 0
      )
    `);

    // 2. Products table
    await connection.query(`
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
    await connection.query(`
      CREATE TABLE IF NOT EXISTS qr_categories (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        icon VARCHAR(255) NOT NULL,
        order_num INT NOT NULL DEFAULT 0
      )
    `);

    // QR Products table
    await connection.query(`
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

    // 3. Settings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(255) PRIMARY KEY,
        val TEXT NOT NULL
      )
    `);

    // 4. Services table
    await connection.query(`
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
    await connection.query(`
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
    await connection.query(`
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
    await connection.query(`
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
    await connection.query(`
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
    await connection.query(`
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

    // Run safe migrations for users fields
    try {
      await connection.query("ALTER TABLE users ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 0");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE users ADD COLUMN otp_code VARCHAR(255) NULL");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE users ADD COLUMN otp_expires BIGINT NULL");
    } catch (e) {}
    try {
      await connection.query("ALTER TABLE users ADD COLUMN phone VARCHAR(50) NULL");
    } catch (e) {}
    
    console.log("[MIGRATION] Schema initialization complete.");
  } catch (err) {
    console.error("[MIGRATION] MySQL connection failed:", err.message);
    process.exit(1);
  }

  let dbData = { users: [] };
  try {
    if (fs.existsSync(DB_FILE)) {
      dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn("[MIGRATION] Warning: database.json could not be read. Using embedded fallback users.");
  }

  // Backup users embedded directly from local database.json (117KB version)
  const backupUsers = [
    {
      "id": "usr-1780950307811-421",
      "name": "Test User",
      "email": "test@almas.com",
      "password_hash": "$2a$10$Bl8ERtiU/ReYRCk0xDS4POWlL2wYJrflBQr0dDsiZunBdMh7tWrle",
      "google_id": null,
      "avatar": null,
      "provider": "email",
      "created_at": 1780950307812
    },
    {
      "id": "usr-bogagourav10-demo",
      "name": "Gourav Boga",
      "email": "bogagourav10@gmail.com",
      "password_hash": "$2a$10$wPfZlDbT78NBISZUJVs5Ue76a6.w4ZDob8lOzB5Op3XPJBGSLd98S",
      "google_id": null,
      "avatar": null,
      "provider": "email",
      "created_at": 1780950307812,
      "is_verified": 1,
      "otp_code": null,
      "otp_expires": null,
      "phone": null
    },
    {
      "id": "usr-1780952416939-54",
      "name": "Test Verify",
      "email": "testverification@gmail.com",
      "password_hash": "$2a$10$fvSsch/XXDQ/Vx4HMtV0QODas..2OlwNac64KUkb7OTTmbbYDG.vm",
      "google_id": null,
      "avatar": null,
      "provider": "email",
      "created_at": 1780952416940,
      "is_verified": 0,
      "otp_code": "304182",
      "otp_expires": 1780953389509
    },
    {
      "id": "usr-1780953498555-191",
      "name": "SMTP Test User",
      "email": "almasindiancuisine@gmail.com",
      "password_hash": "$2a$10$HYlBEef7tYLI7Gj96ljrBeZqcJZRPxKVjFbyramH.jrjr4S82Mvna",
      "google_id": null,
      "avatar": null,
      "provider": "email",
      "created_at": 1780953498556,
      "is_verified": 0,
      "otp_code": "589287",
      "otp_expires": 1780954112865
    },
    {
      "id": "usr-1780954256180-989",
      "name": "Gourav",
      "email": "bogagourav10",
      "password_hash": "$2a$10$00dDEKpMYx91dJtuNqKzYenQ0flQGB9VXs1RwqcM7l1N52DcWu40.",
      "google_id": null,
      "avatar": null,
      "provider": "email",
      "created_at": 1780954256187,
      "is_verified": 0,
      "otp_code": "495352",
      "otp_expires": 1780954858527
    },
    {
      "id": "usr-1781131294940-522",
      "name": "Gourav Boga",
      "email": "gouravboga12@gmail.com",
      "password_hash": null,
      "google_id": "103395675108948711705",
      "avatar": "https://lh3.googleusercontent.com/a/ACg8ocJbh7HVeZKkPC9G1NnHnUqDO6ZEUu6HeUPOFafm_i4-uvwFaw=s96-c",
      "provider": "google",
      "created_at": 1781131294940,
      "is_verified": 1,
      "otp_code": null,
      "otp_expires": null,
      "phone": null
    },
    {
      "id": "usr-1781132039232-47",
      "name": "Test Gourav",
      "email": "tgourav@example.com",
      "password_hash": "$2a$10$OXa.7lJ633.mjsOqhz04je50VOmjxOV.EOMJi5b3oIjDgF0mdqKUi",
      "google_id": null,
      "avatar": null,
      "provider": "email",
      "created_at": 1781132039233,
      "is_verified": 0,
      "otp_code": "140627",
      "otp_expires": 1781132973108,
      "phone": null
    },
    {
      "id": "usr-1781188161173-373",
      "name": "Test Checkout User",
      "email": "testcheckout@example.com",
      "password_hash": "$2a$10$pPt2dO.tO26G/9vRdJDzk.iVmvgd0fDCGys9O.8hAsX8sO1/pBHlG",
      "google_id": null,
      "avatar": null,
      "provider": "email",
      "created_at": 1781188161176,
      "is_verified": 0,
      "otp_code": "780562",
      "otp_expires": 1781188905728,
      "phone": null
    }
  ];

  // Merge users, preferring JSON users if they exist, but including backup ones
  const mergedUsers = [...(dbData.users || [])];
  for (const bu of backupUsers) {
    if (!mergedUsers.some(mu => (mu.email || '').toLowerCase().trim() === bu.email.toLowerCase().trim())) {
      mergedUsers.push(bu);
    }
  }

  // 1. Migrate Users
  console.log(`[MIGRATION] Found ${mergedUsers.length} users to migrate. Migrating...`);
  let usersMigrated = 0;
  for (const u of mergedUsers) {
    try {
      // Check if user already exists
      const [existing] = await connection.query("SELECT id FROM users WHERE email = ?", [u.email]);
      if (existing.length > 0) {
        console.log(`[MIGRATION] User ${u.email} already exists, skipping.`);
        continue;
      }

      await connection.query(
        `INSERT INTO users (id, name, email, password_hash, google_id, avatar, provider, created_at, is_verified, otp_code, otp_expires, phone) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          u.id,
          u.name || '',
          (u.email || '').toLowerCase().trim(),
          u.password_hash || null,
          u.google_id || null,
          u.avatar || null,
          u.provider || 'email',
          u.created_at || Date.now(),
          u.is_verified ? 1 : 0,
          u.otp_code || null,
          u.otp_expires || null,
          u.phone || null
        ]
      );
      usersMigrated++;
      console.log(`[MIGRATION] Successfully imported user: ${u.email}`);
    } catch (e) {
      console.error(`[MIGRATION] Failed to import user ${u.email}:`, e.message);
    }
  }
  console.log(`[MIGRATION] Migrated ${usersMigrated}/${mergedUsers.length} users.`);

  // 2. Migrate Inquiries
  const inquiries = dbData.inquiries || [];
  console.log(`[MIGRATION] Found ${inquiries.length} inquiries in database.json. Migrating...`);
  let inquiriesMigrated = 0;
  for (const inq of inquiries) {
    try {
      const [existing] = await connection.query("SELECT id FROM inquiries WHERE id = ?", [inq.id]);
      if (existing.length > 0) {
        continue;
      }
      await connection.query(
        `INSERT INTO inquiries (id, name, phone, email, message, type, selectedPackage, guestCount, timestamp, dateString, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          inq.id,
          inq.name,
          inq.phone,
          inq.email,
          inq.message || '',
          inq.type,
          inq.selectedPackage || null,
          inq.guestCount || null,
          inq.timestamp || Date.now(),
          inq.dateString || new Date().toLocaleString(),
          inq.status || 'new'
        ]
      );
      inquiriesMigrated++;
    } catch (e) {
      console.error(`[MIGRATION] Failed to import inquiry ${inq.id}:`, e.message);
    }
  }
  console.log(`[MIGRATION] Migrated ${inquiriesMigrated}/${inquiries.length} inquiries.`);

  // 3. Migrate Settings
  if (dbData.settings) {
    console.log("[MIGRATION] Migrating global settings...");
    try {
      await connection.query(
        "INSERT INTO settings (id, val) VALUES (?, ?) ON DUPLICATE KEY UPDATE val = ?",
        ['global', JSON.stringify(dbData.settings), JSON.stringify(dbData.settings)]
      );
      console.log("[MIGRATION] Settings migrated successfully.");
    } catch (e) {
      console.error("[MIGRATION] Failed to migrate settings:", e.message);
    }
  }

  // 4. Migrate Orders
  const orders = dbData.orders || [];
  console.log(`[MIGRATION] Found ${orders.length} orders in database.json. Migrating...`);
  let ordersMigrated = 0;
  for (const o of orders) {
    try {
      const [existing] = await connection.query("SELECT id FROM orders WHERE id = ?", [o.id]);
      if (existing.length > 0) {
        continue;
      }
      await connection.query(
        `INSERT INTO orders (id, user_id, name, email, phone, type, address, time, items, status, payment, tax, total, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          o.id,
          o.user_id,
          o.name,
          o.email,
          o.phone,
          o.type,
          o.address,
          o.time,
          typeof o.items === 'string' ? o.items : JSON.stringify(o.items),
          o.status,
          o.payment,
          parseFloat(o.tax || 0),
          parseFloat(o.total || 0),
          o.created_at || Date.now()
        ]
      );
      ordersMigrated++;
    } catch (e) {
      console.error(`[MIGRATION] Failed to import order ${o.id}:`, e.message);
    }
  }
  console.log(`[MIGRATION] Migrated ${ordersMigrated}/${orders.length} orders.`);

  console.log("[MIGRATION] Database migration process finished successfully!");
  await connection.end();
}

migrate().catch(err => {
  console.error("[MIGRATION] Fatal migration error:", err);
  process.exit(1);
});
