import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { StyleId } from '../data/types'

// In-memory navigation. The app is a small set of screens, but there is only ONE
// route — nothing is written to the URL. A page reload therefore always drops the
// user back on the first screen (home). Back navigation works via an in-memory stack.

export type ScreenName = 'home' | 'style' | 'list' | 'detail' | 'contest' | 'chance'

/**
 * Which screens render a full-bleed painting backdrop (the `*-bg` layers in the
 * page components). Kept next to ScreenName and typed as an exhaustive Record so
 * adding a new screen forces a decision here — this is the single source of
 * "has artwork", read by the day/night toggle to glow only over paintings.
 */
export const SCREEN_HAS_BACKDROP: Record<ScreenName, boolean> = {
  home: true,
  style: false,
  list: false,
  detail: false,
  contest: true,
  chance: true,
}

export interface Screen {
  name: ScreenName
  params?: {
    /** Selected style on the list screen. */
    styleId?: StyleId
    /** Selected look on the detail screen. */
    lookId?: string
    /** Set when the detail was reached via the Chance flow. */
    fromChance?: boolean
    /** Gender chosen in the Chance flow (for re-rolling). */
    gender?: 'woman' | 'man' | 'any'
  }
}

interface NavValue {
  current: Screen
  canGoBack: boolean
  /** Push a new screen onto the stack. */
  go: (name: ScreenName, params?: Screen['params']) => void
  /** Swap the current screen in place (no new history entry). */
  replace: (name: ScreenName, params?: Screen['params']) => void
  /** Pop back to the previous screen. */
  back: () => void
  /** Clear the stack and return to the first screen. */
  reset: () => void
}

const NavContext = createContext<NavValue | null>(null)

const ROOT: Screen = { name: 'home' }

export function NavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Screen[]>([ROOT])

  const go = useCallback((name: ScreenName, params?: Screen['params']) => {
    setStack((s) => [...s, { name, params }])
  }, [])

  const replace = useCallback((name: ScreenName, params?: Screen['params']) => {
    setStack((s) => [...s.slice(0, -1), { name, params }])
  }, [])

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))
  }, [])

  const reset = useCallback(() => setStack([ROOT]), [])

  const value = useMemo<NavValue>(
    () => ({
      current: stack[stack.length - 1],
      canGoBack: stack.length > 1,
      go,
      replace,
      back,
      reset,
    }),
    [stack, go, replace, back, reset],
  )

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNav(): NavValue {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used within NavProvider')
  return ctx
}
