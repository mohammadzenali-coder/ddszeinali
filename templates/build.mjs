// Generates Bauhaus frame templates (SVG + PNG) in templates/svg and templates/png.
// Run: node templates/build.mjs
// SVGs embed Vazirmatn (from @fontsource) so they open correctly anywhere; PNGs are rendered with headless Edge.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const C = { bg: '#F7F4EE', w: '#FFFFFF', k: '#111111', t2: '#4B5563', r: '#CC3333', y: '#F4C430', b: '#1C39BB' };

const font = (wt) => readFileSync(resolve(here, `../node_modules/@fontsource/vazirmatn/files/vazirmatn-arabic-${wt}-normal.woff2`)).toString('base64');
const fontCss = [400, 600, 800].map((wt) => `@font-face{font-family:Vazirmatn;font-weight:${wt};src:url(data:font/woff2;base64,${font(wt)}) format('woff2');}`).join('');

const SIZES = {
  post: { W: 1080, H: 1080 },
  story: { W: 1080, H: 1920 },
  cover: { W: 1200, H: 900 },
};

const SAMPLE = {
  label: 'یادداشت',
  title: ['عنوان یادداشت', 'در اینجا قرار می‌گیرد'],
  sub: 'یک جمله‌ی کوتاه برای توضیح موضوع',
};

// Text block, right-aligned (RTL) at x = right edge of the box.
function text({ x, y, w, s, light = false, filled }) {
  if (!filled) return '';
  const fg = light ? C.w : C.k, fg2 = light ? C.w : C.t2;
  const right = x + w;
  const tSize = Math.round(76 * s), lh = Math.round(tSize * 1.35);
  let out = `<rect x="${right - 22 * s}" y="${y - 22 * s}" width="${22 * s}" height="${22 * s}" fill="${C.r}"/>`;
  out += `<text x="${right - 36 * s}" y="${y}" font-size="${28 * s}" font-weight="600" fill="${fg}">${SAMPLE.label}</text>`;
  let ty = y + 40 * s + tSize;
  for (const line of SAMPLE.title) { out += `<text x="${right}" y="${ty}" font-size="${tSize}" font-weight="800" fill="${fg}">${line}</text>`; ty += lh; }
  out += `<text x="${right}" y="${ty + 10 * s}" font-size="${36 * s}" font-weight="400" fill="${fg2}">${SAMPLE.sub}</text>`;
  return out;
}

function footer({ x, y, w, s, light = false }) {
  const fg = light ? C.w : C.k;
  return `<text x="${x + w}" y="${y}" font-size="${32 * s}" font-weight="800" fill="${fg}">دکتر محمد رضا زینلی</text>`
    + `<text x="${x}" y="${y}" class="ltr" font-size="${28 * s}" font-weight="600" fill="${fg}">ddszeinali.ir</text>`;
}

// Variations. Each returns SVG body for a W x H canvas.
const VARIANTS = {
  // Blue art panel at the inline-end side (left in RTL), text on the right.
  panel({ W, H, s, filled, tall }) {
    const pad = 72 * s;
    if (tall) {
      const ph = H * 0.42;
      return `<rect width="${W}" height="${H}" fill="${C.bg}"/>`
        + `<rect width="${W}" height="${ph}" fill="${C.b}"/>`
        + `<circle cx="${W * 0.62}" cy="${ph * 0.55}" r="${W * 0.24}" fill="${C.y}"/>`
        + `<rect x="0" y="${ph - W * 0.22}" width="${W * 0.28}" height="${W * 0.22}" fill="${C.r}"/>`
        + `<rect y="${ph}" width="${W}" height="${12 * s}" fill="${C.k}"/>`
        + text({ x: pad, y: ph + 170 * s, w: W - 2 * pad, s, filled })
        + `<rect y="${H - 150 * s}" width="${W}" height="${4 * s}" fill="${C.k}"/>`
        + footer({ x: pad, y: H - 70 * s, w: W - 2 * pad, s });
    }
    const pw = W * 0.36;
    return `<rect width="${W}" height="${H}" fill="${C.bg}"/>`
      + `<rect width="${pw}" height="${H}" fill="${C.b}"/>`
      + `<circle cx="${pw * 0.55}" cy="${H * 0.38}" r="${pw * 0.36}" fill="${C.y}"/>`
      + `<rect x="0" y="${H - pw * 0.6}" width="${pw * 0.6}" height="${pw * 0.6}" fill="${C.r}"/>`
      + `<rect x="${pw}" width="${10 * s}" height="${H}" fill="${C.k}"/>`
      + text({ x: pw + 64 * s, y: H * 0.3, w: W - pw - 64 * s - pad, s: s * 0.82, filled })
      + footer({ x: pw + 64 * s, y: H - pad, w: W - pw - 64 * s - pad, s: s * 0.82 });
  },
  // Yellow field, black footer band, red square + blue triangle.
  band({ W, H, s, filled, tall }) {
    const pad = 72 * s, bandH = 130 * s;
    return `<rect width="${W}" height="${H}" fill="${C.y}"/>`
      + `<rect x="${W - 200 * s}" y="0" width="${200 * s}" height="${200 * s}" fill="${C.r}"/>`
      + `<path d="M0 ${H - bandH} L${W * 0.3} ${H - bandH - W * 0.3} L${W * 0.6} ${H - bandH}Z" fill="${C.b}"/>`
      + `<rect y="${H - bandH}" width="${W}" height="${bandH}" fill="${C.k}"/>`
      + text({ x: pad, y: (tall ? H * 0.32 : H * 0.34), w: W - 2 * pad, s, filled })
      + footer({ x: pad, y: H - bandH / 2 + 12 * s, w: W - 2 * pad, s, light: true });
  },
  // White card with thick black border on a red/blue split field.
  card({ W, H, s, filled, tall }) {
    const m = 64 * s, b = 8 * s;
    const cy = tall ? H * 0.28 : H * 0.2, ch = tall ? H * 0.5 : H * 0.6;
    return `<rect width="${W}" height="${H}" fill="${C.r}"/>`
      + `<rect y="${H / 2}" width="${W}" height="${H / 2}" fill="${C.b}"/>`
      + `<circle cx="${m + 70 * s}" cy="${m + 70 * s}" r="${70 * s}" fill="${C.y}"/>`
      + `<rect x="${m}" y="${cy}" width="${W - 2 * m}" height="${ch}" fill="${C.w}" stroke="${C.k}" stroke-width="${b}"/>`
      + text({ x: m + 56 * s, y: cy + 110 * s, w: W - 2 * m - 112 * s, s: s * 0.9, filled })
      + footer({ x: m + 56 * s, y: cy + ch - 56 * s, w: W - 2 * m - 112 * s, s: s * 0.9 });
  },
  // Cream field, thick black frame, shape motif row (square, circle, triangle).
  minimal({ W, H, s, filled }) {
    const m = 48 * s, b = 12 * s, pad = m + 64 * s, sh = 64 * s;
    const top = m + 72 * s;
    return `<rect width="${W}" height="${H}" fill="${C.bg}"/>`
      + `<rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}" fill="none" stroke="${C.k}" stroke-width="${b}"/>`
      + `<rect x="${W - pad - sh}" y="${top}" width="${sh}" height="${sh}" fill="${C.r}"/>`
      + `<circle cx="${W - pad - sh * 2.2}" cy="${top + sh / 2}" r="${sh / 2}" fill="${C.y}"/>`
      + `<path d="M${W - pad - sh * 4.4} ${top + sh} L${W - pad - sh * 3.9} ${top} L${W - pad - sh * 3.4} ${top + sh}Z" fill="${C.b}"/>`
      + text({ x: pad, y: H * 0.42, w: W - 2 * pad, s, filled })
      + `<rect x="${pad}" y="${H - m - 150 * s}" width="${W - 2 * pad}" height="${4 * s}" fill="${C.k}"/>`
      + footer({ x: pad, y: H - m - 72 * s, w: W - 2 * pad, s });
  },
};

const svgDir = resolve(here, 'svg'), pngDir = resolve(here, 'png'), tmp = resolve(here, '.tmp');
for (const d of [svgDir, pngDir, tmp]) { rmSync(d, { recursive: true, force: true }); mkdirSync(d, { recursive: true }); }

const made = [];
for (const [size, { W, H }] of Object.entries(SIZES)) {
  const s = Math.min(W, H) / 1080, tall = H > W * 1.2;
  for (const [vName, fn] of Object.entries(VARIANTS)) {
    for (const filled of [true, false]) {
      const name = `${size}-${vName}${filled ? '' : '-blank'}`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
        + `<style>${fontCss}text{font-family:Vazirmatn,Tahoma,sans-serif;direction:rtl;text-anchor:start;}text.ltr{direction:ltr;text-anchor:start;}</style>`
        + fn({ W, H, s, filled, tall }) + `</svg>`;
      writeFileSync(resolve(svgDir, `${name}.svg`), svg);
      // HTML wrapper so Edge renders at exact pixel size with no margins.
      const html = `<!doctype html><html><head><style>html,body{margin:0;overflow:hidden}</style></head><body>${svg}</body></html>`;
      const htmlPath = resolve(tmp, `${name}.html`);
      writeFileSync(htmlPath, html);
      execFileSync(EDGE, ['--headless', '--disable-gpu', '--hide-scrollbars', `--window-size=${W},${H}`,
        `--screenshot=${resolve(pngDir, `${name}.png`)}`, `file:///${htmlPath.replace(/\\/g, '/')}`], { stdio: 'ignore' });
      made.push(name);
    }
  }
}
rmSync(tmp, { recursive: true, force: true });
console.log(`${made.length} templates created in templates/svg and templates/png`);
