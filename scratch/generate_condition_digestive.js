process.env.TEMP = 'd:/Company Project/Pharmacy/scratch';
process.env.TMP = 'd:/Company Project/Pharmacy/scratch';
const sharp = require('sharp');
sharp.concurrency(1);
sharp.cache(false);
const path = require('path');

const imgDir = 'd:/Company Project/Pharmacy/images';

const svg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#eef0f3" />
      <stop offset="100%" stop-color="#d7dbe1" />
    </linearGradient>
    <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f172a" stop-opacity="0.35" />
      <stop offset="55%" stop-color="#0f172a" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="bottleBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="18%" stop-color="#ffffff" />
      <stop offset="55%" stop-color="#f8fafc" />
      <stop offset="85%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
    <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8b5cf6" />
      <stop offset="45%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#5b21b6" />
    </linearGradient>
    <linearGradient id="tabletGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="55%" stop-color="#f3f4f6" />
      <stop offset="100%" stop-color="#d1d5db" />
    </linearGradient>
    <filter id="softDepth" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.20" />
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#bg)" />
  <ellipse cx="512" cy="812" rx="330" ry="40" fill="url(#floorShadow)" />

  <g filter="url(#softDepth)">
    <rect x="432" y="190" width="160" height="74" rx="16" fill="url(#capGrad)" />
    <rect x="470" y="258" width="84" height="46" rx="8" fill="#e8eaed" />
    <rect x="392" y="296" width="240" height="356" rx="54" fill="url(#bottleBody)" stroke="#cbd5e1" stroke-width="2.5" />

    <rect x="396" y="326" width="232" height="290" fill="#ffffff" />
    <rect x="396" y="326" width="232" height="28" fill="#7c3aed" />

    <text x="512" y="398" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="34" fill="#0f172a">DIGESTIVE</text>
    <text x="512" y="436" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="34" fill="#0f172a">CARE</text>

    <rect x="424" y="460" width="176" height="5" rx="2.5" fill="#ede9fe" />
    <text x="512" y="498" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="21" fill="#7c3aed">ANTACID + GUT SOOTHING</text>
    <text x="512" y="530" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="16" fill="#64748b">FAST RELIEF FROM ACIDITY</text>
    <text x="512" y="585" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="18" fill="#0f172a">30 CHEWABLE TABLETS</text>
  </g>

  <g transform="rotate(-8 430 700)" filter="url(#softDepth)">
    <ellipse cx="430" cy="700" rx="72" ry="26" fill="url(#tabletGrad)" stroke="#d1d5db" stroke-width="2" />
    <line x1="430" y1="680" x2="430" y2="720" stroke="#c4b5fd" stroke-width="5" />
    <ellipse cx="420" cy="692" rx="10" ry="4" fill="#ffffff" opacity="0.8" />
  </g>

  <g transform="rotate(9 615 716)" filter="url(#softDepth)">
    <ellipse cx="615" cy="716" rx="64" ry="23" fill="url(#tabletGrad)" stroke="#d1d5db" stroke-width="2" />
    <line x1="615" y1="698" x2="615" y2="734" stroke="#c4b5fd" stroke-width="4.5" />
    <ellipse cx="606" cy="709" rx="9" ry="3.5" fill="#ffffff" opacity="0.8" />
  </g>
</svg>`;

(async () => {
  const dest = path.join(imgDir, 'condition-digestive-care.webp');
  const info = await sharp(Buffer.from(svg)).webp({ quality: 92 }).toFile(dest);
  console.log(`Rendered ${dest}: ${info.width}x${info.height} ${info.size} bytes`);

  const buf = await sharp(dest).raw().toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0, n = 0;
  for (let i = 0; i < buf.data.length; i += 40) { r += buf.data[i]; g += buf.data[i + 1]; b += buf.data[i + 2]; n++; }
  console.log(`avgRGB=(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`);
})();