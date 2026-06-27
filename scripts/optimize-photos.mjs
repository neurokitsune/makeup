// Converts full-res originals in /raw into web-ready WebP copies in /public.
// Originals (big phone photos) stay untouched and git-ignored.
//
//   raw/styles/<name>.{jpg,png}          -> public/styles/<name>.webp   (landscape covers)
//   raw/lines/<name>.{jpg,png}           -> public/looks/lines/<name>.webp
//   raw/rhinestones/<name>.{jpg,png}     -> public/looks/rhinestones/<name>.webp
//   raw/bg/<name>.{jpg,png}              -> public/bg/<name>.webp        (full-screen backdrops)
//
// Look photos double as the artist's makeup reference, so they stay high quality
// (QUALITY) at full size; each also gets a small <name>.thumb.webp for the list grid.
// Decorative backgrounds are veiled behind content, so they compress hard (BG_QUALITY).
//
// File base names are preserved — reference them from src/data/content.ts.
// Run with: npm run optimize
import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, parse, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rawRoot = join(root, 'raw')

// [source subfolder, output folder, target width]
// Style covers are landscape; looks are portrait shown near full width.
const JOBS = [
  ['styles', join(root, 'public', 'styles'), 1000],
  ['lines', join(root, 'public', 'looks', 'lines'), 1000],
  ['rhinestones', join(root, 'public', 'looks', 'rhinestones'), 1000],
  ['pearls', join(root, 'public', 'looks', 'pearls'), 1000],
  ['men', join(root, 'public', 'looks', 'men'), 1000],
  ['flowers', join(root, 'public', 'looks', 'flowers'), 1000],
]

const QUALITY = 80
// Small banner thumbnails shown in the look list (card crops to a 21:10 strip).
const THUMB_WIDTH = 640
const THUMB_QUALITY = 72
// Folders whose photos also get a .thumb.webp (the look galleries, not style covers).
const THUMB_FOLDERS = new Set(['lines', 'rhinestones', 'pearls', 'men', 'flowers'])
// Full-screen painted backdrops: resized + compressed hard (they sit behind a veil).
const BG_WIDTH = 1000
const BG_QUALITY = 58

if (!existsSync(rawRoot)) {
  console.error(`Source folder not found: ${rawRoot}`)
  console.error('Create raw/styles, raw/lines, raw/rhinestones and add photos.')
  process.exit(1)
}

let converted = 0
for (const [sub, outDir, width] of JOBS) {
  const srcDir = join(rawRoot, sub)
  if (!existsSync(srcDir)) {
    console.warn(`skip: raw/${sub} (no folder)`)
    continue
  }
  await mkdir(outDir, { recursive: true })

  const files = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  for (const file of files) {
    const { name } = parse(file)
    const src = join(srcDir, file)
    const out = join(outDir, `${name}.webp`)
    await sharp(src)
      .rotate() // honor EXIF orientation from phone cameras
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out)
    converted++

    // List-grid thumbnail: a fraction of the full file's weight, decoded fast.
    if (THUMB_FOLDERS.has(sub)) {
      await sharp(src)
        .rotate()
        .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
        .webp({ quality: THUMB_QUALITY })
        .toFile(join(outDir, `${name}.thumb.webp`))
    }
  }
  console.log(`${sub}: ${files.length} photos`)
}

// Full-screen backdrops: raw/bg/<name>.{jpg,png} -> public/bg/<name>.webp
const bgSrcDir = join(rawRoot, 'bg')
if (existsSync(bgSrcDir)) {
  const bgOutDir = join(root, 'public', 'bg')
  await mkdir(bgOutDir, { recursive: true })
  const files = (await readdir(bgSrcDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  for (const file of files) {
    const { name } = parse(file)
    await sharp(join(bgSrcDir, file))
      .rotate()
      .resize({ width: BG_WIDTH, withoutEnlargement: true })
      .webp({ quality: BG_QUALITY })
      .toFile(join(bgOutDir, `${name}.webp`))
    converted++
  }
  console.log(`bg: ${files.length} backdrops`)
} else {
  console.warn('skip: raw/bg (no folder)')
}

// Artist avatar: raw/daria.{jpg,png,webp} → square, face-centered → public/daria.webp
for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
  const src = join(rawRoot, `daria.${ext}`)
  if (existsSync(src)) {
    await sharp(src)
      .rotate()
      .resize(400, 400, { fit: 'cover', position: sharp.strategy.attention })
      .webp({ quality: 82 })
      .toFile(join(root, 'public', 'daria.webp'))
    console.log('artist avatar written')
    break
  }
}

console.log(`\nDone. ${converted} photos written to public/`)
