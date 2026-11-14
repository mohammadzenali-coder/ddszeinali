# قالب‌ها (Templates)

Bauhaus frames that match the website design (same colors, shapes, and Vazirmatn font). This folder is **not** part of the website build.

## Files

- `png/` ready-to-use images
- `svg/` editable vector files (Vazirmatn is embedded, so they open correctly in a browser, Figma, Illustrator, Inkscape)

| Size | Use | Pixels |
|---|---|---|
| `post-*` | Instagram post | 1080×1080 |
| `story-*` | Instagram story | 1080×1920 |
| `cover-*` | Article cover (4:3, like the site pictures) | 1200×900 |

Each size comes in 4 variations: `panel` (blue panel + yellow circle), `band` (yellow field + black footer band), `card` (white card on red/blue), `minimal` (cream with thick black frame and the square/circle/triangle motif).
Files ending in `-blank` have only the frame, name and website, with no sample text, so you can add your own text in any editor.

## Change the text or regenerate

Edit `SAMPLE` (label, two title lines, subtitle) in `templates/build.mjs`, then run:

```bash
node templates/build.mjs
```

It rewrites `svg/` and `png/`. PNGs are rendered with Microsoft Edge (already on Windows), so the font is identical to the website. No extra packages are needed.
