import { useLang } from '../i18n/LanguageContext'
import { useNav } from '../app/navigation'
import { useTheme } from '../theme/ThemeContext'
import { useToast } from '../components/ToastContext'
import AppHeader from '../components/AppHeader'
import Footer from '../components/Footer'
import { randomLookForGender } from '../data/content'
import { asset } from '../data/types'
import { track } from '../analytics'
import { TOAST_PHRASES } from '../i18n/translations'

const BG = {
  day: asset('bg/woman-man-light.webp'),
  night: asset('bg/woman-man-dark.webp'),
}

export default function ChancePage() {
  const { t, loc } = useLang()
  const { go } = useNav()
  const { theme } = useTheme()
  const { showToast } = useToast()

  const pick = (gender: 'woman' | 'man' | 'any') => {
    // 'any' is the "prefer not to say" choice.
    track('chance_pick', { gender })
    const look = randomLookForGender(gender)
    if (!look) return
    // "Prefer not to say" gets no toast.
    if (gender !== 'any') {
      const phrases = TOAST_PHRASES[gender]
      showToast(loc(phrases[Math.floor(Math.random() * phrases.length)]))
    }
    go('detail', { styleId: look.styleId, lookId: look.id, fromChance: true, gender })
  }

  return (
    <main className="page chance">
      <div className="chance-bg" aria-hidden="true">
        <img className="chance-bg__img" src={BG[theme]} alt="" />
        <div className="chance-bg__veil" />
      </div>

      <AppHeader />

      <div className="chance__content">
        <h1 className="chance__prompt">{t('chancePrompt')}</h1>
        <div className="chance__options">
          <button className="btn chance__woman" onClick={() => pick('woman')}>
            <span aria-hidden="true">♀</span> {t('chanceWoman')}
          </button>
          <button className="btn chance__man" onClick={() => pick('man')}>
            <span aria-hidden="true">♂</span> {t('chanceMan')}
          </button>
        </div>
        <button className="chance__prefer" onClick={() => pick('any')}>
          {t('chancePreferNot')}
        </button>
      </div>

      <Footer />
    </main>
  )
}
