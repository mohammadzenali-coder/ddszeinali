// تولید تصویر اشتراک‌گذاری (public/og.png) — اجرا: npm run og
import sharp from 'sharp';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<rect width="1200" height="630" fill="#F7F4EE"/>
<rect x="0" y="0" width="420" height="630" fill="#1C39BB"/>
<circle cx="300" cy="315" r="140" fill="#F4C430"/>
<rect x="0" y="470" width="260" height="160" fill="#CC3333"/>
<rect x="0" y="600" width="1200" height="30" fill="#111111"/>
<text x="1130" y="270" text-anchor="end" font-family="Vazirmatn, Tahoma" font-weight="800" font-size="64" fill="#111111">دکتر محمد رضا زینلی</text>
<text x="1130" y="360" text-anchor="end" font-family="Vazirmatn, Tahoma" font-weight="600" font-size="44" fill="#4B5563">دندانپزشکی زیبایی</text>
<text x="1130" y="470" text-anchor="end" font-family="Tahoma" font-weight="700" font-size="30" fill="#111111">ddszeinali.ir</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('public/og.png created');
