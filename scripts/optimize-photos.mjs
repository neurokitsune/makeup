// Converts full-res originals in /raw into web-ready WebP copies in /public.
// Originals (big phone photos) stay untouched and git-ignored.
//
//   raw/styles/<name>.{jpg,png}          -> public/styles/<name>.webp   (landscape covers)
//   raw/lines/<name>.{jpg,png}           -> public/looks/lines/<name>.webp
//   raw/rhinestones/<name>.{jpg,png}     -> public/looks/rhinestones/<name>.webp
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
    const out = join(outDir, `${name}.webp`)
    await sharp(join(srcDir, file))
      .rotate() // honor EXIF orientation from phone cameras
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out)
    converted++
  }
  console.log(`${sub}: ${files.length} photos`)
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
