process.env.TEMP = 'd:/Company Project/Pharmacy/scratch';
process.env.TMP = 'd:/Company Project/Pharmacy/scratch';
const sharp = require('sharp');
sharp.concurrency(1);
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

      <linearGradient id="metalFoil" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="20%" stop-color="#cbd5e1" />
        <stop offset="50%" stop-color="#f8fafc" />
        <stop offset="75%" stop-color="#94a3b8" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </linearGradient>

      <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#451a03" />
        <stop offset="20%" stop-color="#78350f" />
        <stop offset="50%" stop-color="#d97706" />
        <stop offset="80%" stop-color="#92400e" />
        <stop offset="100%" stop-color="#451a03" />
      </linearGradient>

      <linearGradient id="redSyrup" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ef4444" />
        <stop offset="50%" stop-color="#dc2626" />
        <stop offset="100%" stop-color="#7f1d1d" />
      </linearGradient>

      <filter id="softDepth" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#0f172a" flood-opacity="0.18" />
      </filter>

      <filter id="pillDepth" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.22" />
      </filter>

      <linearGradient id="bluePillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#bae6fd" />
        <stop offset="40%" stop-color="#38bdf8" />
        <stop offset="80%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#0369a1" />
      </linearGradient>

      <linearGradient id="whitePillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="60%" stop-color="#f1f5f9" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </linearGradient>

      <linearGradient id="yellowPillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a" />
        <stop offset="50%" stop-color="#eab308" />
        <stop offset="100%" stop-color="#854d0e" />
      </linearGradient>

      <linearGradient id="redPillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fca5a5" />
        <stop offset="50%" stop-color="#ef4444" />
        <stop offset="100%" stop-color="#991b1b" />
      </linearGradient>

      <linearGradient id="amberLozengeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fde047" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="#f59e0b" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#b45309" stop-opacity="0.95"/>
      </linearGradient>

      <linearGradient id="tubeBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#cbd5e1" />
        <stop offset="25%" stop-color="#ffffff" />
        <stop offset="65%" stop-color="#f8fafc" />
        <stop offset="85%" stop-color="#cbd5e1" />
        <stop offset="100%" stop-color="#94a3b8" />
      </linearGradient>
    </defs>

    <rect width="600" height="600" fill="url(#studioBg)" />
    <ellipse cx="300" cy="495" rx="210" ry="26" fill="url(#floorShadow)" />
    ${content}
  </svg>`;
}

function generateNaproxenSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, -10)">
      <g transform="rotate(-8 300 300)" filter="url(#softDepth)">
        <rect x="175" y="135" width="250" height="330" rx="14" fill="url(#metalFoil)" stroke="#94a3b8" stroke-width="1.5" />
        <path d="M 175 180 H 425 M 175 240 H 425 M 175 300 H 425 M 175 360 H 425 M 175 420 H 425" stroke="#64748b" stroke-width="0.5" opacity="0.4" stroke-dasharray="2,2"/>
        <path d="M 258 135 V 465 M 342 135 V 465" stroke="#64748b" stroke-width="0.5" opacity="0.4" stroke-dasharray="2,2"/>

        <text x="300" y="162" text-anchor="middle" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="700" font-size="12" fill="#0f172a" letter-spacing="1">NAPROXEN 250mg</text>
        <text x="300" y="174" text-anchor="middle" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-weight="600" font-size="9" fill="#0284c7" letter-spacing="0.5">STACKLY PHARMA • BATCH #9842</text>

        ${[
          {x:200, y:195}, {x:326, y:195},
          {x:200, y:255}, {x:326, y:255},
          {x:200, y:315}, {x:326, y:315},
          {x:200, y:375}, {x:326, y:375}
        ].map(p => `
          <circle cx="${p.x+36}" cy="${p.y+20}" r="21" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
          <circle cx="${p.x+36}" cy="${p.y+20}" r="18" fill="url(#bluePillGrad)" stroke="#38bdf8" stroke-width="0.5"/>
          <ellipse cx="${p.x+30}" cy="${p.y+14}" rx="8" ry="4" fill="#ffffff" opacity="0.6"/>
        `).join('')}
      </g>

      <g transform="translate(385, 435) rotate(15)" filter="url(#pillDepth)">
        <circle cx="24" cy="24" r="22" fill="url(#bluePillGrad)" stroke="#38bdf8" stroke-width="1"/>
        <ellipse cx="18" cy="16" rx="9" ry="4" fill="#ffffff" opacity="0.6"/>
        <text x="24" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="10" fill="#ffffff">NAP 250</text>
      </g>
    </g>
  `);
}

function generateCoughSyrupSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 0)">
      <g filter="url(#softDepth)">
        <path d="M 260 135 L 250 180 H 350 L 340 135 Z" fill="#ffffff" opacity="0.85" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect x="255" y="180" width="90" height="25" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
        <path d="M 240 220 C 220 240 210 260 210 290 V 440 C 210 455 225 465 240 465 H 360 C 375 465 390 455 390 440 V 290 C 390 260 380 240 360 220 Z" fill="url(#amberGlass)" stroke="#451a03" stroke-width="2"/>
        <path d="M 212 300 V 440 C 212 453 225 463 240 463 H 360 C 375 463 388 453 388 440 V 300 Z" fill="url(#redSyrup)" opacity="0.45"/>

        <rect x="214" y="270" width="172" height="165" fill="#ffffff"/>
        <rect x="214" y="270" width="172" height="10" fill="#dc2626"/>

        <text x="300" y="305" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="15" fill="#0f172a">COUGH SYRUP</text>
        <text x="300" y="325" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="11" fill="#dc2626">DEXTROMETHORPHAN</text>

        <line x1="240" y1="340" x2="360" y2="340" stroke="#e2e8f0" stroke-width="1"/>
        <text x="300" y="365" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="10" fill="#475569">SOOTHING CHESTY COUGH</text>
        <text x="300" y="415" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="14" fill="#0f172a">NET WT. 100 ml</text>
      </g>
    </g>
  `);
}

function generateNasalSpraySvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 10)">
      <g filter="url(#softDepth)">
        <path d="M 280 120 L 275 220 H 325 L 320 120 Z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5"/>
        <rect x="273" y="215" width="54" height="12" rx="2" fill="#0284c7"/>
        <rect x="260" y="227" width="80" height="25" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <path d="M 245 252 H 355 V 272 H 245 Z" fill="#0284c7"/>
        <rect x="235" y="272" width="130" height="180" rx="16" fill="url(#tubeBodyGrad)" stroke="#cbd5e1" stroke-width="2"/>
        
        <rect x="237" y="295" width="126" height="135" fill="#ffffff"/>
        <rect x="237" y="295" width="126" height="8" fill="#0284c7"/>

        <text x="300" y="325" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="12" fill="#0f172a">NASAL SPRAY</text>
        <text x="300" y="342" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="10" fill="#0284c7">DECONGESTANT</text>
        <text x="300" y="375" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="9" fill="#64748b">FAST SINUS RELIEF</text>
        <text x="300" y="410" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="11" fill="#0f172a">15 ml</text>
      </g>
    </g>
  `);
}

function generateCoughLozengesSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, -10)">
      <g transform="rotate(-10 300 300)" filter="url(#softDepth)">
        <rect x="170" y="140" width="260" height="320" rx="14" fill="url(#metalFoil)" stroke="#94a3b8" stroke-width="1.5" />
        <text x="300" y="170" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="13" fill="#0f172a" letter-spacing="1">MENTHOL LOZENGES</text>
        <text x="300" y="184" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="9" fill="#16a34a" letter-spacing="0.5">SOOTHING THROAT CARE • PACK OF 12</text>

        ${[
          {x: 185, y: 200}, {x: 250, y: 200}, {x: 315, y: 200}, {x: 380, y: 200},
          {x: 185, y: 280}, {x: 250, y: 280}, {x: 315, y: 280}, {x: 380, y: 280},
          {x: 185, y: 360}, {x: 250, y: 360}, {x: 315, y: 360}, {x: 380, y: 360}
        ].map(p => `
          <circle cx="${p.x+18}" cy="${p.y+22}" r="22" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
          <circle cx="${p.x+18}" cy="${p.y+22}" r="19" fill="url(#amberLozengeGrad)" stroke="#f59e0b" stroke-width="0.5"/>
          <ellipse cx="${p.x+12}" cy="${p.y+16}" rx="8" ry="4" fill="#ffffff" opacity="0.7"/>
        `).join('')}
      </g>
    </g>
  `);
}

function generateColdRelief10Svg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 0)">
      <g filter="url(#softDepth)">
        <polygon points="180,180 380,140 440,200 240,240" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
        <polygon points="180,180 240,240 240,430 180,370" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
        <polygon points="240,240 440,200 440,390 240,430" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>

        <rect x="255" y="260" width="160" height="8" fill="#ef4444" transform="skewY(-11)"/>
        <text x="330" y="300" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="16" fill="#0f172a" transform="skewY(-11)">COLD RELIEF</text>
        <text x="330" y="322" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="12" fill="#0284c7" transform="skewY(-11)">MULTI-SYMPTOM</text>
        <text x="330" y="355" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="10" fill="#64748b" transform="skewY(-11)">10 CAPLETS • MAX STRENGTH</text>
      </g>
    </g>
  `);
}

function generateVitaminCSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 10)">
      <g filter="url(#softDepth)">
        <rect x="245" y="140" width="110" height="310" rx="12" fill="url(#tubeBodyGrad)" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="240" y="130" width="120" height="25" rx="4" fill="#f97316" stroke="#ea580c" stroke-width="1"/>

        <rect x="247" y="180" width="106" height="230" fill="#ffffff"/>
        <rect x="247" y="180" width="106" height="12" fill="#f97316"/>

        <text x="300" y="215" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="14" fill="#0f172a">VITAMIN C</text>
        <text x="300" y="235" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="12" fill="#f97316">500mg</text>
        <text x="300" y="270" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="9" fill="#64748b">EFFERVESCENT</text>
        <text x="300" y="380" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="10" fill="#f97316">20 TABLETS</text>
      </g>

      <g transform="translate(370, 410) rotate(20)" filter="url(#pillDepth)">
        <circle cx="30" cy="30" r="28" fill="#fdba74" stroke="#f97316" stroke-width="1.5"/>
        <circle cx="30" cy="30" r="23" fill="#fb923c"/>
        <ellipse cx="20" cy="20" rx="10" ry="5" fill="#ffffff" opacity="0.6"/>
      </g>
    </g>
  `);
}

function generateVitaminBSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, -10)">
      <g transform="rotate(-8 300 300)" filter="url(#softDepth)">
        <rect x="175" y="135" width="250" height="330" rx="14" fill="url(#metalFoil)" stroke="#94a3b8" stroke-width="1.5" />
        <text x="300" y="162" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="12" fill="#0f172a" letter-spacing="1">VITAMIN B-COMPLEX</text>

        ${[
          {x:200, y:195}, {x:326, y:195},
          {x:200, y:255}, {x:326, y:255},
          {x:200, y:315}, {x:326, y:315},
          {x:200, y:375}, {x:326, y:375}
        ].map(p => `
          <rect x="${p.x}" y="${p.y}" width="72" height="36" rx="18" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5" filter="url(#pillDepth)" />
          <path d="M ${p.x+3} ${p.y+3} H ${p.x+36} V ${p.y+33} H ${p.x+3} Z" fill="url(#redPillGrad)" rx="15"/>
          <path d="M ${p.x+36} ${p.y+3} H ${p.x+69} V ${p.y+33} H ${p.x+36} Z" fill="url(#yellowPillGrad)" rx="15"/>
        `).join('')}
      </g>
    </g>
  `);
}

function generateOmega3Svg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 0)">
      <g filter="url(#softDepth)">
        <rect x="240" y="160" width="120" height="35" rx="6" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
        <rect x="215" y="200" width="170" height="250" rx="20" fill="url(#tubeBodyGrad)" stroke="#cbd5e1" stroke-width="2" opacity="0.9"/>
        
        ${[
          {cx: 260, cy: 380}, {cx: 300, cy: 390}, {cx: 340, cy: 375},
          {cx: 280, cy: 410}, {cx: 320, cy: 420}, {cx: 250, cy: 420}
        ].map(s => `
          <ellipse cx="${s.cx}" cy="${s.cy}" rx="18" ry="11" fill="url(#amberLozengeGrad)" stroke="#f59e0b" stroke-width="0.75"/>
        `).join('')}

        <rect x="217" y="240" width="166" height="120" fill="#ffffff"/>
        <rect x="217" y="240" width="166" height="8" fill="#0284c7"/>

        <text x="300" y="270" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="14" fill="#0f172a">OMEGA-3 FISH OIL</text>
        <text x="300" y="290" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="12" fill="#0284c7">1000 mg</text>
        <text x="300" y="320" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="10" fill="#475569">HEART &amp; BRAIN HEALTH</text>
        <text x="300" y="345" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="9" fill="#94a3b8">30 SOFTGELS</text>
      </g>
    </g>
  `);
}

function generateIronFolicSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, -10)">
      <g transform="rotate(-6 300 300)" filter="url(#softDepth)">
        <rect x="175" y="135" width="250" height="330" rx="14" fill="url(#metalFoil)" stroke="#94a3b8" stroke-width="1.5" />
        <text x="300" y="162" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="12" fill="#0f172a" letter-spacing="1">IRON + FOLIC ACID</text>

        ${[
          {x:200, y:195}, {x:326, y:195},
          {x:200, y:255}, {x:326, y:255},
          {x:200, y:315}, {x:326, y:315},
          {x:200, y:375}, {x:326, y:375}
        ].map(p => `
          <circle cx="${p.x+36}" cy="${p.y+20}" r="21" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5" filter="url(#pillDepth)"/>
          <circle cx="${p.x+36}" cy="${p.y+20}" r="18" fill="url(#redPillGrad)" stroke="#ef4444" stroke-width="0.5"/>
          <ellipse cx="${p.x+30}" cy="${p.y+14}" rx="8" ry="4" fill="#ffffff" opacity="0.5"/>
        `).join('')}
      </g>
    </g>
  `);
}

function generateCalciumD3Svg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 0)">
      <g filter="url(#softDepth)">
        <rect x="230" y="160" width="140" height="35" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="210" y="200" width="180" height="250" rx="22" fill="url(#tubeBodyGrad)" stroke="#cbd5e1" stroke-width="2"/>

        <rect x="212" y="240" width="176" height="170" fill="#ffffff"/>
        <rect x="212" y="240" width="176" height="10" fill="#3b82f6"/>

        <text x="300" y="275" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="15" fill="#0f172a">CALCIUM + D3</text>
        <text x="300" y="295" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="12" fill="#3b82f6">500mg / 400IU</text>
        <text x="300" y="330" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="10" fill="#475569">BONE &amp; TEETH SUPPORT</text>
        <text x="300" y="385" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="10" fill="#94a3b8">60 TABLETS</text>
      </g>

      <g transform="translate(380, 420)" filter="url(#pillDepth)">
        <circle cx="24" cy="24" r="22" fill="url(#whitePillGrad)" stroke="#cbd5e1" stroke-width="1.5"/>
        <line x1="24" y1="4" x2="24" y2="44" stroke="#cbd5e1" stroke-width="1.5"/>
      </g>
    </g>
  `);
}

function generateBPMonitorSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 0)">
      <g transform="translate(130, 200)" filter="url(#softDepth)">
        <rect x="0" y="0" width="150" height="230" rx="16" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
        <rect x="15" y="15" width="120" height="200" rx="8" fill="#334155" stroke-dasharray="4,4" stroke="#64748b"/>
        <text x="75" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#94a3b8">ARM CUFF</text>
      </g>

      <path d="M 220 360 C 220 425 300 425 300 375" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>

      <g transform="translate(255, 170)" filter="url(#softDepth)">
        <rect x="0" y="0" width="205" height="255" rx="22" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="18" y="22" width="169" height="145" rx="12" fill="#0f172a"/>

        <text x="32" y="58" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">SYS mmHg</text>
        <text x="168" y="68" text-anchor="end" font-family="'Courier New', monospace" font-weight="800" font-size="34" fill="#38bdf8">120</text>

        <text x="32" y="105" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">DIA mmHg</text>
        <text x="168" y="115" text-anchor="end" font-family="'Courier New', monospace" font-weight="800" font-size="34" fill="#4ade80">80</text>

        <text x="32" y="145" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">PULSE /min</text>
        <text x="168" y="152" text-anchor="end" font-family="'Courier New', monospace" font-weight="800" font-size="22" fill="#ef4444">72</text>

        <rect x="30" y="188" width="65" height="36" rx="8" fill="#0284c7"/>
        <text x="62" y="211" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="#ffffff">START</text>

        <rect x="110" y="188" width="65" height="36" rx="8" fill="#e2e8f0"/>
        <text x="142" y="211" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="11" fill="#475569">MEM</text>
      </g>
    </g>
  `);
}

function generatePulseOximeterSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 10)">
      <g transform="rotate(-12 300 300)" filter="url(#softDepth)">
        <rect x="200" y="175" width="200" height="250" rx="28" fill="#0f172a" stroke="#020617" stroke-width="3"/>
        <rect x="210" y="185" width="180" height="230" rx="20" fill="#1e293b"/>

        <rect x="225" y="205" width="150" height="135" rx="10" fill="#000000" stroke="#334155" stroke-width="1.5"/>

        <text x="240" y="235" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#38bdf8">%SpO2</text>
        <text x="350" y="265" text-anchor="end" font-family="'Courier New', monospace" font-weight="800" font-size="44" fill="#38bdf8">98</text>

        <text x="240" y="290" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#4ade80">PR bpm</text>
        <text x="350" y="320" text-anchor="end" font-family="'Courier New', monospace" font-weight="800" font-size="36" fill="#4ade80">75</text>

        <circle cx="300" cy="372" r="16" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5"/>
      </g>
    </g>
  `);
}

function generateWeighingScaleSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 0)">
      <g filter="url(#softDepth)">
        <rect x="145" y="175" width="310" height="280" rx="24" fill="url(#tubeBodyGrad)" stroke="#cbd5e1" stroke-width="3"/>
        <rect x="155" y="185" width="290" height="260" rx="18" fill="#ffffff" opacity="0.75"/>

        <rect x="235" y="210" width="130" height="55" rx="8" fill="#0f172a"/>
        <text x="300" y="248" text-anchor="middle" font-family="'Courier New', monospace" font-weight="800" font-size="28" fill="#38bdf8">68.5 kg</text>

        <circle cx="180" cy="210" r="12" fill="#94a3b8"/>
        <circle cx="420" cy="210" r="12" fill="#94a3b8"/>
        <circle cx="180" cy="420" r="12" fill="#94a3b8"/>
        <circle cx="420" cy="420" r="12" fill="#94a3b8"/>
      </g>
    </g>
  `);
}

function generateIRThermometerSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 0)">
      <g transform="rotate(-20 300 300)" filter="url(#softDepth)">
        <path d="M 220 180 C 220 150 250 140 320 140 L 400 140 V 220 L 320 220 C 310 220 300 240 290 380 H 230 L 250 220 C 230 220 220 200 220 180 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <path d="M 400 140 V 220 L 320 220 C 310 220 300 240 290 380 H 230 L 250 220 C 230 220 220 200 220 180 Z" fill="#0284c7" opacity="0.15"/>

        <rect x="250" y="160" width="80" height="45" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>
        <text x="290" y="190" text-anchor="middle" font-family="'Courier New', monospace" font-weight="800" font-size="20" fill="#0369a1">36.6 C</text>
      </g>
    </g>
  `);
}

function generateHandSanitizerSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 0)">
      <g filter="url(#softDepth)">
        <rect x="280" y="120" width="40" height="15" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
        <path d="M 270 135 H 350 V 155 H 270 Z" fill="#e2e8f0"/>
        <rect x="290" y="155" width="20" height="35" fill="#cbd5e1"/>

        <rect x="220" y="190" width="160" height="260" rx="22" fill="url(#tubeBodyGrad)" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="222" y="230" width="156" height="218" rx="18" fill="#38bdf8" opacity="0.25"/>

        <rect x="224" y="250" width="152" height="160" fill="#ffffff"/>
        <rect x="224" y="250" width="152" height="8" fill="#0284c7"/>

        <text x="300" y="280" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="13" fill="#0f172a">HAND SANITIZER</text>
        <text x="300" y="298" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="11" fill="#0284c7">ANTISEPTIC GEL</text>
        <text x="300" y="330" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="9" fill="#64748b">KILLS 99.9% GERMS</text>
        <text x="300" y="390" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="13" fill="#0f172a">500 ml</text>
      </g>
    </g>
  `);
}

function generateSunscreenSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 10)">
      <g transform="rotate(-15 300 300)" filter="url(#softDepth)">
        <rect x="255" y="120" width="90" height="40" rx="4" fill="#fef08a" stroke="#eab308" stroke-width="1.5"/>
        <path d="M 265 160 L 220 400 H 380 L 335 160 Z" fill="url(#tubeBodyGrad)" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="215" y="395" width="170" height="20" fill="#94a3b8" rx="2"/>

        <path d="M 255 190 L 235 360 H 365 L 345 190 Z" fill="#ffffff" opacity="0.95"/>
        <rect x="245" y="210" width="110" height="8" fill="#eab308"/>

        <text x="300" y="245" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="14" fill="#0f172a">SUNSCREEN</text>
        <text x="300" y="265" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="16" fill="#eab308">SPF 50+</text>
        <text x="300" y="300" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="9" fill="#64748b">BROAD SPECTRUM UVA/UVB</text>
        <text x="300" y="335" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="10" fill="#475569">50g</text>
      </g>
    </g>
  `);
}

function generateAntisepticCreamSvg() {
  return wrapPhotoSvg(`
    <g transform="translate(0, 10)">
      <g transform="rotate(-12 300 300)" filter="url(#softDepth)">
        <rect x="255" y="120" width="90" height="40" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <path d="M 265 160 L 220 400 H 380 L 335 160 Z" fill="url(#tubeBodyGrad)" stroke="#cbd5e1" stroke-width="2"/>
        <rect x="215" y="395" width="170" height="20" fill="#94a3b8" rx="2"/>

        <path d="M 255 190 L 235 360 H 365 L 345 190 Z" fill="#ffffff" opacity="0.95"/>
        <rect x="245" y="210" width="110" height="8" fill="#dc2626"/>

        <text x="300" y="245" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="13" fill="#0f172a">ANTISEPTIC</text>
        <text x="300" y="265" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="11" fill="#dc2626">FIRST AID CREAM</text>
        <text x="300" y="300" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="9" fill="#64748b">WOUND CARE &amp; CUTS</text>
        <text x="300" y="335" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="10" fill="#475569">25g</text>
      </g>
    </g>
  `);
}

const itemsToGenerate = [
  { file: 'product-naproxen-250mg.webp', gen: generateNaproxenSvg },
  { file: 'product-cough-syrup-100ml.webp', gen: generateCoughSyrupSvg },
  { file: 'product-nasal-decongestant.webp', gen: generateNasalSpraySvg },
  { file: 'product-cough-lozenges-12.webp', gen: generateCoughLozengesSvg },
  { file: 'product-cold-relief-10.webp', gen: generateColdRelief10Svg },
  { file: 'product-vitamin-c-500mg.webp', gen: generateVitaminCSvg },
  { file: 'product-vitamin-b-complex.webp', gen: generateVitaminBSvg },
  { file: 'product-omega3-fish-oil-30.webp', gen: generateOmega3Svg },
  { file: 'product-iron-folic-acid.webp', gen: generateIronFolicSvg },
  { file: 'product-calcium-d3.webp', gen: generateCalciumD3Svg },
  { file: 'product-digital-bp-monitor.webp', gen: generateBPMonitorSvg },
  { file: 'product-pulse-oximeter.webp', gen: generatePulseOximeterSvg },
  { file: 'product-weighing-scale.webp', gen: generateWeighingScaleSvg },
  { file: 'product-thermometer-ir.webp', gen: generateIRThermometerSvg },
  { file: 'product-hand-sanitizer-500ml.webp', gen: generateHandSanitizerSvg },
  { file: 'product-sunscreen-spf50.webp', gen: generateSunscreenSvg },
  { file: 'product-antiseptic-cream-25g.webp', gen: generateAntisepticCreamSvg },
];

async function runSequential() {
  console.log(`Starting photorealistic WebP rendering for ${itemsToGenerate.length} products...`);
  for (let i = 0; i < itemsToGenerate.length; i++) {
    const item = itemsToGenerate[i];
    try {
      const svgStr = item.gen();
      const destPath = path.join(imgDir, item.file);
      const info = await sharp(Buffer.from(svgStr)).webp({ quality: 92 }).toFile(destPath);
      console.log(`[${i+1}/${itemsToGenerate.length}] Rendered ${item.file}: ${info.size} bytes`);
    } catch (err) {
      console.error(`Error on ${item.file}:`, err);
    }
  }
}

runSequential();
