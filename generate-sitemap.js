import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsDataPath = path.join(__dirname, 'src', 'products-data.js');
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');

// Read products-data.js
const fileContent = fs.readFileSync(productsDataPath, 'utf8');

// Simple regex to extract all "id": "..." properties
const idRegex = /"id":\s*"([^"]+)"/g;
const ids = [];
let match;
while ((match = idRegex.exec(fileContent)) !== null) {
  // Avoid duplicate ids if any
  if (!ids.includes(match[1])) {
    ids.push(match[1]);
  }
}

console.log(`Extracted ${ids.length} product IDs.`);

// Construct sitemap entries
const coreUrls = [
  { loc: 'https://almasindiancuisine.ca/', priority: '1.0', changefreq: 'weekly' },
  { loc: 'https://almasindiancuisine.ca/menu', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://almasindiancuisine.ca/products', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://almasindiancuisine.ca/services', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://almasindiancuisine.ca/about', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://almasindiancuisine.ca/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://almasindiancuisine.ca/reservations', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://almasindiancuisine.ca/terms', priority: '0.3', changefreq: 'yearly' },
  { loc: 'https://almasindiancuisine.ca/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: 'https://almasindiancuisine.ca/refunds', priority: '0.3', changefreq: 'yearly' }
];

const sitemapLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

// Add core URLs
coreUrls.forEach(url => {
  sitemapLines.push('  <url>');
  sitemapLines.push(`    <loc>${url.loc}</loc>`);
  sitemapLines.push('    <lastmod>2026-06-18</lastmod>');
  sitemapLines.push(`    <changefreq>${url.changefreq}</changefreq>`);
  sitemapLines.push(`    <priority>${url.priority}</priority>`);
  sitemapLines.push('  </url>');
});

// Add dynamic product detail URLs
ids.forEach(id => {
  sitemapLines.push('  <url>');
  sitemapLines.push(`    <loc>https://almasindiancuisine.ca/product-detail?id=${id}</loc>`);
  sitemapLines.push('    <lastmod>2026-06-18</lastmod>');
  sitemapLines.push('    <changefreq>weekly</changefreq>');
  sitemapLines.push('    <priority>0.6</priority>');
  sitemapLines.push('  </url>');
});

sitemapLines.push('</urlset>');
sitemapLines.push('');

fs.writeFileSync(sitemapPath, sitemapLines.join('\n'), 'utf8');
console.log('Successfully updated public/sitemap.xml with product URLs.');
