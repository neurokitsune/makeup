# Купалле — макіяж / Kupalle makeup

Mobile-first web app for the Kupalle (Belarusian summer solstice) celebration.
Visitors scan the QR code, browse makeup styles, and pick a look to show the artist.

Stack: React + Vite + TypeScript (same pattern as `kitsunebi`). BE/EN toggle,
Belarusian default. Deployed to GitHub Pages on every push to `main`.

## Flow

1. **Home** — title + Begin button
2. **Style** — choose a style (*Lines*, *Rhinestones*, *Flowers*, *Pearls*,
   *Men*), enter the *Contest*, or let *Chance* pick a look at random
3. **List** — every look for the chosen style
4. **Detail** — large photo + name, with Previous/Next to cycle siblings

Navigation is in-memory (no URL routing); a reload returns to home.

## Day / Night theme

Used outdoors, so there's a large sun/moon button floating in the bottom-right
corner on every screen. It **defaults to the local time of day** (bright high-contrast "day" theme 07:00–20:59, dark "night"
theme otherwise) and remembers the user's choice. Day mode is tuned for direct
sunlight (dark ink on warm paper); night mode is the Kupalle dark theme.
See [`src/theme/ThemeContext.tsx`](src/theme/ThemeContext.tsx); palettes live in
[`src/styles.css`](src/styles.css) under `:root` and `:root[data-theme='day']`.

## Home page backdrop + sparks

The main page shows a full-bleed painting that switches with the theme, plus
warm "sparks" drifting upward (the `spark-rise` effect). The two paintings:

```
public/bg/home-day.webp    # bright daytime painting
public/bg/home-night.webp  # dark night painting
```

Backgrounds are generated from `raw/bg/<name>.{jpg,png}` by `npm run optimize`
(resized to 1000px wide, compressed hard at ~58% quality since a scrim sits over
them) and written as `.webp`. Drop the real paintings into `raw/bg/` keeping the
same base names, then re-run the optimizer. A theme-aware scrim (`--home-veil`)
and text shadow (`--home-text-shadow`) keep the title legible over any image.

## Run

```bash
npm install
npm run dev      # http://localhost:5173/makeup/
npm run build    # typecheck + production build to dist/
```

## Adding the real looks (20+ per style)

There are two steps: optimize the photos, then list them.

### 1. Optimize raw photos → WebP

Drop the full-res originals (straight from the camera) into the git-ignored
`raw/` folder, then run the optimizer:

```
raw/styles/<name>.jpg          # style covers (optional — SVG placeholders ship by default)
raw/lines/<name>.jpg           # one file per Lines look
raw/rhinestones/<name>.jpg     # …and likewise flowers/, pearls/, men/
raw/bg/<name>.jpg              # full-screen backdrops
raw/daria.jpg                  # artist avatar

npm run optimize               # → public/styles/ and public/looks/<style>/<name>.webp
```

The script ([`scripts/optimize-photos.mjs`](scripts/optimize-photos.mjs))
resizes to 1000px wide, fixes EXIF rotation, and writes `.webp` (~80% quality),
keeping each file's base name. Each look photo doubles as the artist's makeup
reference, so the full-size file stays high quality; alongside it the script also
emits a small `<name>.thumb.webp` (640px, ~72% quality) used for the fast-loading
look-list grid. Originals stay in `raw/` and are never committed.

### 2. List them — edit ONE file

All content lives in [`src/data/content.ts`](src/data/content.ts). For each look
add an entry with the `image` path (e.g. `looks/lines/<name>.webp`) and the
`name` + `description` in both `be` and `en`. Looks display in source order.

The committed style-cover `*.svg` files are abstract placeholders — replace them
with real covers by dropping photos in `raw/styles/` and re-running `npm run optimize`.

## Analytics

[Umami](https://umami.is) (privacy-friendly, cookieless). The script lives in
[`index.html`](index.html) — **set `data-website-id`** to this site's id from your
Umami dashboard (it ships with a `REPLACE_WITH_UMAMI_WEBSITE_ID` placeholder, so
nothing is logged until you fill it in). [`src/analytics.ts`](src/analytics.ts) is
a thin, vendor-agnostic wrapper (also works with Plausible / PostHog / GA4) and
no-ops when no script is loaded, logging to the console in dev instead.

Every event carries a `session` id (a per-visit uuid in `sessionStorage`) so all of
a visit's events group together across the in-memory screens and in-tab reloads.
Note: this groups a *visit*, not a person across devices — a static site has no
login/backend to do true cross-device identity.

Events:

| event | properties | fires when |
|-------|-----------|-----------|
| `device_info` | device type, os, browser, touch, standalone, viewport, screen, dpr, lang | once per session |
| `screen_view` | `screen` (home/style/list/detail/contest/chance) | each screen visit (home = main-page visit) |
| `start_click` | — | home Start button |
| `category_select` | `category` (contest, lines, rhinestones, flowers, pearls, men, chance) | a card on the style screen |
| `look_view` | `look`, `style`, `chance` | a look detail is opened |
| `chance_pick` | `gender` (woman/man/any) | Woman / Man / "prefer not to say" |
| `try_again` | `gender` | "Try again" re-roll on a Chance look |
| `contest_open` | `source` (detail) | "Win 100 zł" link on a look detail |
| `instagram_click` | `account` (neurokitsune/daria_kalechits), `location` (footer/detail/contest) | an Instagram link |
| `contest_entry` | `instagram` | contest form submitted |
| `theme_toggle` | `to` (day/night) | day/night button |
| `lang_toggle` | `to` (be/en) | BE/EN toggle |

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
The Vite `base` is `/makeup/` (repo `neurokitsune/makeup`) — override with the
`VITE_BASE` env var if the path changes. Enable Pages → "GitHub Actions" in repo
settings once.
