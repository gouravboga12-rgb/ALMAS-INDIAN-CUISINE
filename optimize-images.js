import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.error('Error: "sharp" library is not installed. Please run "npm install sharp" to install it.');
    process.exit(1);
  }

  console.log('Scanning root directory for large images to optimize...');
  const files = fs.readdirSync(__dirname);

  const imageExtensions = ['.png', '.jpg', '.jpeg'];
  let optimizedCount = 0;
  let skippedCount = 0;
  let totalSavedBytes = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!imageExtensions.includes(ext)) continue;

    // Skip screenshots, overlays, vercel/github configs, etc.
    if (file.startsWith('Screenshot') || file.startsWith('WhatsApp') || file === 'logo.png') {
      console.log(`Skipping system/special asset: ${file}`);
      skippedCount++;
      continue;
    }

    const filePath = path.join(__dirname, file);
    const stats = fs.statSync(filePath);
    const sizeInKB = stats.size / 1024;

    // Only process images larger than 250KB to avoid redundant compression of already optimized assets
    if (sizeInKB < 250) {
      skippedCount++;
      continue;
    }

    console.log(`Processing: ${file} (${sizeInKB.toFixed(2)} KB)`);

    try {
      // Get metadata (dimensions)
      const metadata = await sharp(filePath).metadata();
      const needsResize = metadata.width > 800 || metadata.height > 800;

      let pipeline = sharp(filePath);
      if (needsResize) {
        // Resize to maximum 800px in either direction while preserving aspect ratio
        pipeline = pipeline.resize({
          width: metadata.width > metadata.height ? 800 : null,
          height: metadata.height >= metadata.width ? 800 : null,
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Compress based on extension
      if (ext === '.png') {
        pipeline = pipeline.png({ quality: 80, compressionLevel: 8, palette: true });
      } else {
        pipeline = pipeline.jpeg({ quality: 80, progressive: true });
      }

      // We write to a temporary file, then overwrite in-place
      const tempPath = path.join(__dirname, `temp_opt_${file}`);
      await pipeline.toFile(tempPath);

      const tempStats = fs.statSync(tempPath);
      const savedBytes = stats.size - tempStats.size;

      if (savedBytes > 0) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        totalSavedBytes += savedBytes;
        optimizedCount++;
        console.log(`  Optimized: ${file} -> ${(tempStats.size / 1024).toFixed(2)} KB (Reduced by ${((savedBytes / stats.size) * 100).toFixed(1)}%)`);
      } else {
        // Temp file is larger or same size, discard temp
        fs.unlinkSync(tempPath);
        skippedCount++;
        console.log(`  Skipped (no size benefit): ${file}`);
      }
    } catch (err) {
      console.error(`  Error processing ${file}:`, err.message);
    }
  }

  console.log('\n--- Optimization Summary ---');
  console.log(`Optimized images: ${optimizedCount}`);
  console.log(`Skipped images: ${skippedCount}`);
  console.log(`Total storage saved: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
}

run();
