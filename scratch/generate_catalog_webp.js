process.env.TEMP = 'd:/Company Project/Pharmacy/scratch';
process.env.TMP = 'd:/Company Project/Pharmacy/scratch';
const sharp = require('sharp');
sharp.concurrency(1);
sharp.cache(false);
const fs = require('fs');
const path = require('path');

const imgDir = 'd:/Company Project/Pharmacy/images';

function wrapPhotoSvg(content) {
  return `<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="studioBg" cx="50%" cy="35%" r="65%" fx="50%" fy="25%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="65%" stop-color="#f1f5f9" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </radialGradient>

      <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#020617" stop-opacity="0.35" />
        <stop offset="45%" stop-color="#0f172a" stop-opacity="0.14" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
      </radialGradient>

      <filter id="softDepth" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.18" />
      </filter>

      <linearGradient id="tubeBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#cbd5e1" />
        <stop offset="25%" stop-color="#ffffff" />
        <stop offset="65%" stop-color="#f8fafc" />
        <stop offset="85%" stop-color="#cbd5e1" />
        <stop offset="100%" stop-color="#94a3b8" />
      </linearGradient>

      <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#451a03" />
        <stop offset="20%" stop-color="#78350f" />
        <stop offset="50%" stop-color="#d97706" />
        <stop offset="80%" stop-color="#92400e" />
        <stop offset="100%" stop-color="#451a03" />
      </linearGradient>
    </defs>

    <rect width="600" height="600" fill="url(#studioBg)" />
    <ellipse cx="300" cy="495" rx="210" ry="26" fill="url(#floorShadow)" />
    ${content}
  </svg>`;
}

function generateTubeProduct(title, sub, vol, color) {
  return wrapPhotoSvg(`
    <g transform="translate(0, 10)">
      <g transform="rotate(-12 300 300)" filter="url(#softDepth)">
        <rect x="255" y="120" width="90" height="40" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <path d="M 265 160 L 220 400 H 380 L 335 160 Z" fill="url(#tubeBodyGrad)" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="215" y="395" width="170" height="20" fill="#94a3b8" rx="2"/>

        <path d="M 255 190 L 235 360 H 365 L 345 190 Z" fill="#ffffff" opacity="0.95"/>
        <rect x="245" y="210" width="110" height="8" fill="${color}"/>

        <text x="300" y="245" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="13" fill="#0f172a">${title.toUpperCase()}</text>
        <text x="300" y="265" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="11" fill="${color}">${sub.toUpperCase()}</text>
        <text x="300" y="335" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="10" fill="#475569">${vol}</text>
      </g>
    </g>
  `);
}

function generateBottleProduct(title, sub, count, color) {
  return wrapPhotoSvg(`
    <g transform="translate(0, 0)">
      <g filter="url(#softDepth)">
        <rect x="235" y="160" width="130" height="40" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="210" y="210" width="180" height="250" rx="24" fill="url(#amberGlass)" stroke="#78350f" stroke-width="2"/>

        <rect x="212" y="245" width="176" height="180" fill="#ffffff"/>
        <rect x="212" y="245" width="176" height="12" fill="${color}"/>

        <text x="300" y="280" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="10" fill="#64748b" text-anchor="middle">STACKLY PHARMA</text>
        <text x="300" y="315" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="15" fill="#0f172a">${title.toUpperCase()}</text>
        <text x="300" y="335" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="12" fill="${color}">${sub.toUpperCase().replace(/&/g, '&amp;')}</text>
        <text x="300" y="372" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="10" fill="#475569">${count}</text>
      </g>
    </g>
  `);
}

const catalogItems = [
  { file: 'product-baby-cream.webp', gen: () => generateTubeProduct('Baby Cream', 'Moisturizing', '75g', '#ec4899') },
  { file: 'product-baby-oil.webp', gen: () => generateBottleProduct('Baby Oil', 'Nourishing Pure', '200ml', '#f59e0b') },
  { file: 'product-baby-powder.webp', gen: () => generateBottleProduct('Baby Powder', 'Talc Free', '200g', '#06b6d4') },
  { file: 'product-baby-shampoo.webp', gen: () => generateBottleProduct('Baby Shampoo', 'Tear Free', '200ml', '#eab308') },
  { file: 'product-baby-wipes.webp', gen: () => generateTubeProduct('Baby Wipes', 'Hypoallergenic', '80 Wipes', '#3b82f6') },
  { file: 'product-biotin.webp', gen: () => generateBottleProduct('Biotin 5000mcg', 'Hair & Nails', '60 Capsules', '#8b5cf6') },
  { file: 'product-body-wash.webp', gen: () => generateBottleProduct('Body Wash', 'Hydrating Wash', '400ml', '#0284c7') },
  { file: 'product-collagen.webp', gen: () => generateBottleProduct('Collagen Peptides', 'Skin & Joints', '250g Powder', '#ec4899') },
  { file: 'product-electric-toothbrush.webp', gen: () => generateTubeProduct('Sonic Toothbrush', 'Electric Power', '1 Device', '#3b82f6') },
  { file: 'product-face-cleanser.webp', gen: () => generateTubeProduct('Face Cleanser', 'Deep Purifying', '100g', '#0d9488') },
  { file: 'product-fitness-powder.webp', gen: () => generateBottleProduct('Whey Isolate', 'Protein Powder', '1000g', '#ef4444') },
  { file: 'product-green-tea.webp', gen: () => generateBottleProduct('Organic Green Tea', 'Antioxidants', '25 Bags', '#16a34a') },
  { file: 'product-hair-oil.webp', gen: () => generateBottleProduct('Herbal Hair Oil', 'Root Therapy', '150ml', '#d97706') },
  { file: 'product-hair-serum.webp', gen: () => generateBottleProduct('Smooth Hair Serum', 'Repair Formula', '50ml', '#7c3aed') },
  { file: 'product-moisturizer.webp', gen: () => generateBottleProduct('Body Moisturizer', 'Daily Hydration', '300ml', '#0284c7') },
  { file: 'product-mouthwash.webp', gen: () => generateBottleProduct('Mouthwash', 'Antiseptic Mint', '250ml', '#10b981') },
  { file: 'product-protein-bar.webp', gen: () => generateTubeProduct('Protein Bar', '20g High Protein', '60g Bar', '#ea580c') },
  { file: 'product-sanitizer-kit.webp', gen: () => generateTubeProduct('Sanitizer Kit', 'Hygiene Travel Pack', '3 Items', '#0284c7') },
  { file: 'product-shampoo.webp', gen: () => generateBottleProduct('Anti-Dandruff Shampoo', 'Scalp Care', '350ml', '#0d9488') },
  { file: 'product-whitening-toothpaste.webp', gen: () => generateTubeProduct('Whitening Toothpaste', 'Enamel Shield', '100g', '#2563eb') },
  { file: 'product-zinc-elderberry.webp', gen: () => generateBottleProduct('Zinc + Elderberry', 'Immune Gummies', '60 Gummies', '#7c3aed') }
];

async function runCatalog() {
  console.log(`Starting WebP rendering for ${catalogItems.length} catalog products...`);
  for (let i = 0; i < catalogItems.length; i++) {
    const item = catalogItems[i];
    try {
      const svgStr = item.gen();
      const destPath = path.join(imgDir, item.file);
      const info = await sharp(Buffer.from(svgStr)).webp({ quality: 92 }).toFile(destPath);
      console.log(`[${i+1}/${catalogItems.length}] Rendered ${item.file}: ${info.size} bytes`);
    } catch (err) {
      console.error(`Error on ${item.file}:`, err.message);
    }
  }
}

runCatalog();
