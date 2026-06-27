import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import AppHeader from '../components/AppHeader'
import Footer from '../components/Footer'
import IgLink from '../components/IgLink'
import { track } from '../analytics'
import { asset } from '../data/types'

// Instagram accounts shown in the contest rules (the artist and the host).
const DARIA = 'daria_kalechits'
const NEURO = 'neurokitsune'

const BG = {
  day: asset('bg/contest-light.jpg'),
  night: asset('bg/contest-dark.jpg'),
}

export default function ContestPage() {
  const { t } = useLang()
  const { theme } = useTheme()
  const [nick, setNick] = useState('')
  const [done, setDone] = useState(false)

  const handle = nick.trim().replace(/^@+/, '')
  const canSubmit = handle.length > 0

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    // Logged as a Umami event; draw the winner from these entries afterwards.
    track('contest_entry', { instagram: handle })
    setDone(true)
  }

  return (
    <main className="page contest">
      <div className="contest-bg" aria-hidden="true">
        <img className="contest-bg__img" src={BG[theme]} alt="" />
        <div className="contest-bg__veil" />
      </div>

      <AppHeader title={t('contestHeader')} />

      <div className="contest__content">
        <div className="contest__prize">
          <img className="contest__art" src={asset('styles/contest.svg')} alt="100 zł" />
          <p className="contest__note">{t('contestPrizeNote')}</p>
        </div>

        {done ? (
          <p className="contest__success">{t('contestSuccess')}</p>
        ) : (
          <>
            <h2 className="contest__how">{t('contestHow')}</h2>
            <ol className="contest__steps">
              <li>
                {t('contestStep1')}{' '}
                <span className="contest__name">@{DARIA}</span>
              </li>
              <li>
                {t('contestStep2')}{' '}
                <IgLink account={DARIA} location="contest" className="contest__tag" /> &amp;{' '}
                <IgLink account={NEURO} location="contest" className="contest__tag" />
              </li>
              <li>
                {t('contestStep3')} <strong>{t('contestStep3Tag')}</strong>{' '}
                {t('contestStep3Or')}
              </li>
            </ol>

            <form className="contest__form" onSubmit={submit}>
              <input
                id="ig-nick"
                className="contest__input"
                type="text"
                aria-label={t('contestInputLabel')}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="@nickname"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
              <button className="btn btn--primary" type="submit" disabled={!canSubmit}>
                {t('contestSubmit')}
              </button>
            </form>
          </>
        )}

        <p className="contest__winner">
          {t('contestWinnerNote')} <strong>{t('contestEventName')}</strong>
        </p>
      </div>

      <Footer />
    </main>
  )
}
