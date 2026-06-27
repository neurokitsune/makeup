import type { Loc, MakeupLook, MakeupStyle, StyleId } from './types'

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT
//
// Look photos live in  public/looks/<style>/<n>.webp  (generated from raw/ by
// `npm run optimize`). Looks are numbered; give them real names/descriptions
// below by overriding LOOK_NAMES / LOOK_DESCRIPTIONS if desired.
// ─────────────────────────────────────────────────────────────────────────────

export const STYLES: MakeupStyle[] = [
  {
    id: 'lines',
    name: { be: 'Лініі', en: 'Lines' },
    tagline: { be: 'Маляваныя ўзоры на твары', en: 'Painted patterns on the face' },
    image: 'styles/lines.svg',
  },
  {
    id: 'rhinestones',
    name: { be: 'Стразы', en: 'Rhinestones' },
    tagline: { be: 'Бліскучыя камені і россып', en: 'Sparkling stones and scatter' },
    image: 'styles/rhinestones.svg',
  },
  {
    id: 'flowers',
    name: { be: 'Кветкі', en: 'Flowers' },
    tagline: { be: 'Кветкі са стразаў вакол вока', en: 'Rhinestone flowers around the eye' },
    image: 'styles/flowers.svg',
  },
  {
    id: 'pearls',
    name: { be: 'Пэрлы', en: 'Pearls' },
    tagline: { be: 'Перламутравыя пацеркі на скуры', en: 'Lustrous pearls on the skin' },
    image: 'styles/pearls.svg',
  },
  {
    id: 'men',
    name: { be: 'Мужчынам', en: 'Men' },
    tagline: { be: 'Стрыманыя вобразы для хлопцаў', en: 'Bold, restrained looks for men' },
    image: 'styles/men.svg',
  },
]

// Names per look, in photo order (public/looks/<style>/1.webp = first entry).
// Kupalle / folk themed; edit freely.
const LOOK_NAMES: Record<StyleId, Loc[]> = {
  lines: [
    { be: 'Папараць', en: 'Fern' },
    { be: 'Вянок', en: 'Wreath' },
    { be: 'Агонь', en: 'Fire' },
    { be: 'Вада', en: 'Water' },
    { be: 'Рака', en: 'River' },
    { be: 'Маланка', en: 'Lightning' },
    { be: 'Хваля', en: 'Wave' },
    { be: 'Вір', en: 'Whirl' },
    { be: 'Зёлкі', en: 'Herbs' },
    { be: 'Палын', en: 'Wormwood' },
    { be: 'Мята', en: 'Mint' },
    { be: 'Лоза', en: 'Vine' },
    { be: 'Ніць', en: 'Thread' },
    { be: 'Узор', en: 'Pattern' },
    { be: 'Папараць-кветка', en: 'Fern Flower' },
    { be: 'Прыцемкі', en: 'Dusk' },
    { be: 'Дзіва', en: 'Wonder' },
    { be: 'Сцяжынка', en: 'Path' },
  ],
  rhinestones: [
    { be: 'Іскры', en: 'Sparks' },
    { be: 'Раса', en: 'Dew' },
    { be: 'Россып', en: 'Scatter' },
    { be: 'Зоры', en: 'Stars' },
    { be: 'Бляск', en: 'Glimmer' },
    { be: 'Кропля', en: 'Drop' },
    { be: 'Вясёлка', en: 'Rainbow' },
    { be: 'Зорапад', en: 'Starfall' },
    { be: 'Камяні', en: 'Stones' },
  ],
  flowers: [
    { be: 'Васілёк', en: 'Cornflower' },
    { be: 'Рамонак', en: 'Daisy' },
    { be: 'Мак', en: 'Poppy' },
  ],
  pearls: [
    { be: 'Месяц', en: 'Moon' },
    { be: 'Святло', en: 'Light' },
    { be: 'Туман', en: 'Mist' },
    { be: 'Крыніца', en: 'Spring' },
    { be: 'Перлінка', en: 'Pearl' },
    { be: 'Зорка', en: 'Star' },
    { be: 'Світанак', en: 'Dawn' },
    { be: 'Лебедзь', en: 'Swan' },
  ],
  men: [
    { be: 'Знак', en: 'Mark' },
    { be: 'Воўк', en: 'Wolf' },
    { be: 'Дуб', en: 'Oak' },
    { be: 'Жар', en: 'Ember' },
    { be: 'Гром', en: 'Thunder' },
    { be: 'Руна', en: 'Rune' },
    { be: 'Сокал', en: 'Falcon' },
    { be: 'Зубр', en: 'Bison' },
    { be: 'Вецер', en: 'Wind' },
    { be: 'Корань', en: 'Root' },
    { be: 'Камень', en: 'Stone' },
    { be: 'Поўнач', en: 'North' },
    { be: 'Крыж', en: 'Cross' },
  ],
}

// Per-look thumbnail crop tweaks (object-position Y %). Default is 35.
const CROP_OVERRIDES: Record<string, number> = {
  // crop a little higher (show more of the upper face)
  'lines-14': 26, // Pattern
  'lines-12': 26, // Vine
  'lines-11': 26, // Mint
  'rhinestones-2': 26, // Dew
  'rhinestones-8': 26, // Starfall
  'pearls-4': 26, // Spring
  'pearls-6': 26, // Star
  'men-10': 26, // Root
  // crop a little lower (show more of the lower face)
  'rhinestones-5': 46, // Glimmer
  'rhinestones-6': 46, // Drop
  'flowers-2': 46, // Daisy
  'pearls-2': 46, // Light
  'pearls-3': 46, // Mist
  'pearls-5': 46, // Pearl
}

// Looks removed from the app (image number preserved for the rest).
const EXCLUDE = new Set<string>(['rhinestones-9', 'men-11'])

// Build the look list: one entry per photo, in order (image number = position).
export const LOOKS: MakeupLook[] = (Object.keys(LOOK_NAMES) as StyleId[]).flatMap(
  (styleId) =>
    LOOK_NAMES[styleId]
      .map((name, i) => {
        const n = i + 1
        const id = `${styleId}-${n}`
        return {
          id,
          styleId,
          name,
          image: `looks/${styleId}/${n}.webp`,
          ...(id in CROP_OVERRIDES ? { crop: CROP_OVERRIDES[id] } : {}),
        } satisfies MakeupLook
      })
      .filter((l) => !EXCLUDE.has(l.id)),
)

export function getStyle(id: StyleId): MakeupStyle | undefined {
  return STYLES.find((s) => s.id === id)
}

export function looksByStyle(id: StyleId): MakeupLook[] {
  return LOOKS.filter((l) => l.styleId === id)
}

export function getLook(id: string): MakeupLook | undefined {
  return LOOKS.find((l) => l.id === id)
}

/** Random look for the Chance flow: man → Men only; woman → all except Men; any → everything. */
export function randomLookForGender(
  gender: 'woman' | 'man' | 'any',
): MakeupLook | undefined {
  const pool =
    gender === 'man'
      ? looksByStyle('men')
      : gender === 'any'
        ? LOOKS
        : LOOKS.filter((l) => l.styleId !== 'men')
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : undefined
}
