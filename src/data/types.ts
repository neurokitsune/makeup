export type Lang = 'be' | 'en'

/** A localized string: Belarusian + English. */
export type Loc = Record<Lang, string>

export type StyleId = 'lines' | 'rhinestones' | 'pearls' | 'men' | 'flowers'

export interface MakeupStyle {
  id: StyleId
  /** Display name of the style. */
  name: Loc
  /** One short line shown under the name on the choose-style page. */
  tagline: Loc
  /** Cover image for the style card, relative to the app base (public/). */
  image: string
}

export interface MakeupLook {
  /** Stable id, e.g. "lines-1". */
  id: string
  styleId: StyleId
  /** Name / title of the look. */
  name: Loc
  /** Optional short description / meaning. */
  description?: Loc
  /** Path to the photo, relative to the app base (public/). */
  image: string
  /** Optional vertical crop focus for the list thumbnail (object-position Y %, default 35). */
  crop?: number
}

/** Prefix a public/ asset path with the configured Vite base. */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path
}
