import { useLang } from '../i18n/LanguageContext'
import { useNav } from '../app/navigation'

/**
 * Top bar shown on every screen except home: a back button on the left and an
 * optional centered screen title. The language toggle is a global fixed control
 * (rendered once in App), so it is not part of the header.
 */
export default function AppHeader({ title }: { title?: string }) {
  const { t } = useLang()
  const { canGoBack, back } = useNav()

  return (
    <header className="app-header">
      {canGoBack ? (
        <button className="back-btn" onClick={back} aria-label={t('back')}>
          <span aria-hidden="true">‹</span> {t('back')}
        </button>
      ) : (
        <span className="back-btn placeholder" />
      )}

      {title && <h1 className="app-header__title">{title}</h1>}
    </header>
  )
}
