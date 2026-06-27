import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang, Loc } from '../data/types'
import { UI } from './translations'
import type { UIKey } from './translations'

const STORAGE_KEY = 'makeup.lang'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  /** Translate a UI key. */
  t: (key: UIKey) => string
  /** Pick the current language out of a localized value (e.g. a look name). */
  loc: (value: Loc) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function initialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'be' || saved === 'en' ? saved : 'be'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])
  const toggle = useCallback(
    () => setLangState((l) => (l === 'be' ? 'en' : 'be')),
    [],
  )
  const t = useCallback((key: UIKey) => UI[key][lang], [lang])
  const loc = useCallback((value: Loc) => value[lang], [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, loc }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
