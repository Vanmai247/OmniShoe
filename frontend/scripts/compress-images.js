const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");

const publicDir = path.join(__dirname, "../public");

const imagesToCompress = [
  "ABZORB 2010 Grey Day's.png",
  "Air Jordan 11 Low 'Mother's Day'.png",
  "Nike Air Max 90 'Hypervenom'.png",
];

async function compress() {
  console.log("⚡ Starting image compression...");
  
  for (const filename of imagesToCompress) {
    const inputPath = path.join(publicDir, filename);
    const outputFilename = filename.replace(/\.png$/i, ".webp");
    const outputPath = path.join(publicDir, outputFilename);
    
    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️ Warning: File not found at ${inputPath}`);
      continue;
    }
    
    const statsBefore = fs.statSync(inputPath);
    const sizeBeforeMB = (statsBefore.size / (1024 * 1024)).toFixed(2);
    
    console.log(`\n⏳ Processing: ${filename} (${sizeBeforeMB} MB)...`);
    
    try {
      const image = await Jimp.read(inputPath);
      
      // Resize if too large (Max width or height: 800px)
      const maxWidth = 800;
      const maxHeight = 800;
      const width = image.getWidth();
      const height = image.getHeight();
      
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          image.resize(maxWidth, Jimp.AUTO);
        } else {
          image.resize(Jimp.AUTO, maxHeight);
        }
        console.log(`   resized from ${width}x${height} to ${image.getWidth()}x${image.getHeight()}`);
      }
      
      // Write to WebP format
      await image.quality(85).writeAsync(outputPath);
      
      const statsAfter = fs.statSync(outputPath);
      const sizeAfterKB = (statsAfter.size / 1024).toFixed(2);
      const compressionRatio = ((1 - statsAfter.size / statsBefore.size) * 100).toFixed(1);
      
      console.log(`   compressed & saved to: ${outputFilename}`);
      console.log(`   size after: ${sizeAfterKB} KB (Reduced by ${compressionRatio}%)`);
      
    } catch (err) {
      console.error(`❌ Error processing ${filename}:`, err);
    }
  }
  
  console.log("\n✅ Image compression complete!");
}

compress();
