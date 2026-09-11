const fs = require('fs');
let code = fs.readFileSync('d:/Company Project/Pharmacy/scratch/generate_photo_webp.js', 'utf8');

code = code.replace(/ENERGY & VITALITY/g, 'ENERGY &amp; VITALITY');
code = code.replace(/HEART & BRAIN/g, 'HEART &amp; BRAIN');
code = code.replace(/BONE & TEETH/g, 'BONE &amp; TEETH');
code = code.replace(/WOUND CARE & CUTS/g, 'WOUND CARE &amp; CUTS');

fs.writeFileSync('d:/Company Project/Pharmacy/scratch/generate_photo_webp.js', code, 'utf8');
console.log('Successfully fixed ampersands in generate_photo_webp.js');
