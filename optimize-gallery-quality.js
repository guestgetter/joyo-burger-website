const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = './JOYO - Images/';
const outputDir = './JOYO - Images/optimized/';

// Gallery images that need better quality
const galleryImages = [
    'joyo-enjoying-chicken-tenders.jpg',
    'joyo-scene.jpg', 
    'joyo-sign.jpg',
    'joyo-milkshake.jpg'
];

async function optimizeGalleryImage(filename) {
    const inputPath = path.join(imageDir, filename);
    const name = path.parse(filename).name;
    const webpPath = path.join(outputDir, `${name}.webp`);
    const jpegPath = path.join(outputDir, `${name}.jpg`);
    
    if (!fs.existsSync(inputPath)) {
        console.log(`❌ File not found: ${inputPath}`);
        return;
    }

    try {
        // Get original image info
        const originalStats = fs.statSync(inputPath);
        const metadata = await sharp(inputPath).metadata();
        
        console.log(`\n🔄 Processing: ${filename}`);
        console.log(`📏 Original: ${metadata.width}x${metadata.height}, ${(originalStats.size / 1024).toFixed(1)}KB`);

        // Create higher quality WebP (quality 80 instead of 60)
        await sharp(inputPath)
            .webp({ 
                quality: 80,
                effort: 6
            })
            .toFile(webpPath);

        // Create higher quality JPEG (quality 75 instead of 60) 
        await sharp(inputPath)
            .jpeg({ 
                quality: 75,
                progressive: true,
                mozjpeg: true
            })
            .toFile(jpegPath);

        // Get new file sizes
        const webpStats = fs.statSync(webpPath);
        const jpegStats = fs.statSync(jpegPath);
        
        console.log(`✅ WebP: ${(webpStats.size / 1024).toFixed(1)}KB (-${(((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1)}%)`);
        console.log(`✅ JPEG: ${(jpegStats.size / 1024).toFixed(1)}KB (-${(((originalStats.size - jpegStats.size) / originalStats.size) * 100).toFixed(1)}%)`);

    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
    }
}

async function main() {
    console.log('🎨 Creating Better Quality Gallery Images...\n');
    
    for (const image of galleryImages) {
        await optimizeGalleryImage(image);
    }
    
    console.log('\n🎉 Gallery image quality upgrade complete!');
}

main(); 