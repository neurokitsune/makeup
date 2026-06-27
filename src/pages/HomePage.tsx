import { useMemo } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { useNav } from '../app/navigation'
import { useTheme } from '../theme/ThemeContext'
import { asset } from '../data/types'
import { track } from '../analytics'
import Footer from '../components/Footer'

// Theme-matched painting backdrops (drop the files into public/bg/).
const BG = {
  day: asset('bg/home-day.webp'),
  night: asset('bg/home-night.webp'),
}

interface Spark {
  left: number
  size: number
  duration: number
  delay: number
  color: string
}

const SPARK_COLORS = ['#ff9a3c', '#ffbe5c', '#ffd27a', '#fff2cf']

function makeSparks(n: number): Spark[] {
  return Array.from({ length: n }, () => ({
    left: Math.random() * 100,
    size: 2 + Math.random() * 3.5,
    duration: 5 + Math.random() * 5,
    delay: Math.random() * 7,
    color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
  }))
}

export default function HomePage() {
  const { t } = useLang()
  const { go } = useNav()
  const { theme } = useTheme()

  // Generated once so sparks don't reshuffle on re-render.
  const sparks = useMemo(() => makeSparks(18), [])

  return (
    <main className="page home">
      <div className="home-bg" aria-hidden="true">
        <img
          className="home-bg__img"
          src={BG[theme]}
          alt=""
          // First paint's largest element — tell the browser to prioritize it.
          fetchPriority="high"
          decoding="async"
        />
        <div className="home-bg__veil" />
        <div className="home-sparks">
          {sparks.map((s, i) => (
            <span
              key={i}
              className="spark"
              style={{
                left: `${s.left}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                background: s.color,
                boxShadow: `0 0 6px ${s.color}`,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="home__hero">
        <div
          className={`home__mark home__mark--${theme === 'day' ? 'sun' : 'moon'}`}
          aria-hidden="true"
        >
          {theme === 'day' ? '☀' : '☾'}
        </div>
        <h1 className="home__title">{t('appTitle')}</h1>
        <p className="home__tagline">{t('homeTagline')}</p>
      </div>

      <div className="home__cta">
        <p className="home__intro">{t('homeIntro')}</p>
        <button
          className="btn btn--primary"
          onClick={() => {
            track('start_click')
            go('style')
          }}
        >
          {t('start')}
        </button>
      </div>

      <Footer />
    </main>
  )
}
