const sharp = require('sharp');
const path = require('path');

const W = 1920;
const H = 1080;

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F8F6FD"/>
      <stop offset="0.55" stop-color="#F1ECF9"/>
      <stop offset="1" stop-color="#EAE3F5"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#C4B5FD" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#C4B5FD" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blob" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#A78BFA" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#A78BFA" stop-opacity="0"/>
    </radialGradient>
    <pattern id="plusGrid" width="170" height="170" patternUnits="userSpaceOnUse">
      <g stroke="#7C3AED" stroke-opacity="0.07" stroke-width="2" stroke-linecap="round" fill="none">
        <path d="M85 58 v54 M58 85 h54"/>
      </g>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#base)"/>
  <rect width="${W}" height="${H}" fill="url(#plusGrid)"/>

  <circle cx="${W * 0.86}" cy="${H * 0.12}" r="420" fill="url(#glow1)"/>
  <circle cx="${W * 0.1}" cy="${H * 0.9}" r="460" fill="url(#glow2)"/>
  <circle cx="${W * 0.45}" cy="${H * 0.3}" r="300" fill="url(#blob)"/>

  <g fill="#6D28D9" opacity="0.12">
    <rect x="150" y="160" width="120" height="120" rx="30" transform="rotate(-8 210 220)"/>
    <rect x="${W - 280}" y="830" width="140" height="140" rx="36" transform="rotate(10 ${W - 210} 900)"/>
  </g>
  <g fill="#7C3AED" opacity="0.1">
    <rect x="1730" y="130" width="96" height="96" rx="24" transform="rotate(14 1778 178)"/>
    <rect x="120" y="900" width="100" height="100" rx="26" transform="rotate(-12 170 950)"/>
  </g>

  <g stroke="#8B5CF6" stroke-opacity="0.16" stroke-width="3.5" stroke-linecap="round" fill="none">
    <path d="M600 175 v60 M570 205 h60"/>
    <path d="M1320 610 v54 M1293 637 h54"/>
    <path d="M300 480 v44 M278 502 h44"/>
    <path d="M1560 320 v48 M1536 344 h48"/>
  </g>
</svg>`);

(async () => {
    await sharp(svg, { density: 144 })
        .webp({ quality: 82, effort: 6 })
        .toFile(path.join(__dirname, '..', 'images', 'dashboard-bg.webp'));
    console.log('done images/dashboard-bg.webp');
})().catch((err) => { console.error(err.message); process.exit(1); });