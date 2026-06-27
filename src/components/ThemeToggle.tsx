import { useTheme } from '../theme/ThemeContext'
import { useNav, SCREEN_HAS_BACKDROP } from '../app/navigation'
import { track } from '../analytics'

/** Round sun/moon button that switches between the day and night themes. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const { current } = useNav()
  const isDay = theme === 'day'
  // Glow only over a painting backdrop so it stands out (calm on plain lists).
  const glow = SCREEN_HAS_BACKDROP[current.name]
  return (
    <button
      className={`theme-toggle${glow ? ' theme-toggle--glow' : ''}`}
      onClick={() => {
        track('theme_toggle', { to: isDay ? 'night' : 'day' })
        toggle()
      }}
      aria-pressed={!isDay}
      aria-label={isDay ? 'Switch to night theme' : 'Switch to day theme'}
      title={isDay ? 'Night' : 'Day'}
    >
      <span aria-hidden="true">{isDay ? '☾' : '☀'}</span>
    </button>
  )
}
