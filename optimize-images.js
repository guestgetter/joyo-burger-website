/**
 * JOYO Burger Image Optimization Script
 * 
 * This script helps convert images to WebP format for better compression
 * and performance. Run this with Node.js to optimize your images.
 * 
 * Prerequisites:
 * npm install sharp
 * 
 * Usage:
 * node optimize-images.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = './JOYO - Images';
const OUTPUT_DIR = './JOYO - Images/optimized';

// Supported input formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png'];

// Quality settings for different image types
const QUALITY_SETTINGS = {
    webp: 80,
    jpeg: 85,
    png: 90
};

// Size presets for responsive images
const SIZE_PRESETS = {
    hero: { width: 1920, height: 1080 },
    gallery: { width: 800, height: 600 },
    category: { width: 400, height: 300 },
    icon: { width: 100, height: 100 },
    logo: { width: 200, height: 80 }
};

async function ensureDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

async function optimizeImage(inputPath, outputDir, preset = null) {
    const fileName = path.basename(inputPath, path.extname(inputPath));
    const outputWebP = path.join(outputDir, `${fileName}.webp`);
    const outputJPEG = path.join(outputDir, `${fileName}.jpg`);
    
    try {
        let sharpInstance = sharp(inputPath);
        
        // Apply preset sizing if specified
        if (preset && SIZE_PRESETS[preset]) {
            const { width, height } = SIZE_PRESETS[preset];
            sharpInstance = sharpInstance.resize(width, height, {
                fit: 'cover',
                position: 'center'
            });
        }
        
        // Generate WebP version
        await sharpInstance
            .clone()
            .webp({ quality: QUALITY_SETTINGS.webp })
            .toFile(outputWebP);
        
        // Generate optimized JPEG as fallback
        await sharpInstance
            .clone()
            .jpeg({ quality: QUALITY_SETTINGS.jpeg, progressive: true })
            .toFile(outputJPEG);
        
        console.log(`✓ Optimized: ${fileName}`);
        
        // Get file sizes for comparison
        const originalSize = fs.statSync(inputPath).size;
        const webpSize = fs.statSync(outputWebP).size;
        const jpegSize = fs.statSync(outputJPEG).size;
        
        const webpReduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
        const jpegReduction = ((originalSize - jpegSize) / originalSize * 100).toFixed(1);
        
        console.log(`  WebP: ${(webpSize / 1024).toFixed(1)}KB (-${webpReduction}%)`);
        console.log(`  JPEG: ${(jpegSize / 1024).toFixed(1)}KB (-${jpegReduction}%)`);
        
    } catch (error) {
        console.error(`✗ Error optimizing ${fileName}:`, error.message);
    }
}

async function getImagePreset(filename) {
    const name = filename.toLowerCase();
    
    if (name.includes('hero') || name.includes('homepage')) return 'hero';
    if (name.includes('logo')) return 'logo';
    if (name.includes('icon')) return 'icon';
    if (name.includes('gallery') || name.includes('scene') || name.includes('sign')) return 'gallery';
    
    // Default category size for menu items and other images
    return 'category';
}

async function optimizeAllImages() {
    console.log('🎨 JOYO Burger Image Optimization Starting...\n');
    
    try {
        await ensureDirectory(OUTPUT_DIR);
        
        const files = fs.readdirSync(IMAGES_DIR);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return SUPPORTED_FORMATS.includes(ext);
        });
        
        if (imageFiles.length === 0) {
            console.log('No images found to optimize.');
            return;
        }
        
        console.log(`Found ${imageFiles.length} images to optimize:\n`);
        
        for (const file of imageFiles) {
            const inputPath = path.join(IMAGES_DIR, file);
            const preset = await getImagePreset(file);
            
            console.log(`Processing: ${file} (${preset} preset)`);
            await optimizeImage(inputPath, OUTPUT_DIR, preset);
            console.log('');
        }
        
        console.log('✅ Image optimization complete!\n');
        console.log('📝 Next steps:');
        console.log('1. Test the optimized images in your browser');
        console.log('2. Update your HTML to use the WebP versions with JPEG fallbacks');
        console.log('3. Replace the original images if satisfied with the results');
        
    } catch (error) {
        console.error('❌ Error during optimization:', error.message);
    }
}

// HTML Picture element generator for WebP with fallback
function generatePictureElement(imageName, alt, width, height) {
    return `<picture>
    <source srcset="JOYO - Images/optimized/${imageName}.webp" type="image/webp">
    <img src="JOYO - Images/optimized/${imageName}.jpg" alt="${alt}" width="${width}" height="${height}" loading="lazy">
</picture>`;
}

// Export helper functions for use in other scripts
module.exports = {
    optimizeImage,
    optimizeAllImages,
    generatePictureElement,
    SIZE_PRESETS,
    QUALITY_SETTINGS
};

// Run optimization if this script is executed directly
if (require.main === module) {
    optimizeAllImages();
} 