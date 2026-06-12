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
  } catch (err) {
    console.error("[MIGRATION] MySQL connection failed:", err.message);
    process.exit(1);
  }

  let dbData;
  try {
    dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error("[MIGRATION] Error reading/parsing database.json:", err.message);
    await connection.end();
    process.exit(1);
  }

  // 1. Migrate Users
  const users = dbData.users || [];
  console.log(`[MIGRATION] Found ${users.length} users in database.json. Migrating...`);
  let usersMigrated = 0;
  for (const u of users) {
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
  console.log(`[MIGRATION] Migrated ${usersMigrated}/${users.length} users.`);

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
