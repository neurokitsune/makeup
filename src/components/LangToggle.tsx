import { useLang } from '../i18n/LanguageContext'
import { track } from '../analytics'

/** Global BE/EN toggle, fixed top-right on every screen (see styles.css). */
export default function LangToggle() {
  const { lang, setLang } = useLang()
  // Only log when the language actually changes (not re-taps of the active one).
  const choose = (to: 'be' | 'en') => {
    if (to !== lang) track('lang_toggle', { to })
    setLang(to)
  }
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        className={lang === 'be' ? 'active' : ''}
        onClick={() => choose('be')}
        aria-pressed={lang === 'be'}
      >
        BE
      </button>
      <button
        className={lang === 'en' ? 'active' : ''}
        onClick={() => choose('en')}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  )
}
