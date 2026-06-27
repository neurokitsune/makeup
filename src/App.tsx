import { useEffect } from 'react'
import { useNav } from './app/navigation'
import { trackScreen, trackDeviceOnce } from './analytics'
import ThemeToggle from './components/ThemeToggle'
import LangToggle from './components/LangToggle'
import HomePage from './pages/HomePage'
import StylePage from './pages/StylePage'
import ListPage from './pages/ListPage'
import DetailPage from './pages/DetailPage'
import ContestPage from './pages/ContestPage'
import ChancePage from './pages/ChancePage'

function CurrentPage() {
  const { current } = useNav()

  // Device / session info, once per session.
  useEffect(() => {
    trackDeviceOnce()
  }, [])

  // Each screen starts at the top — in-memory nav doesn't reset scroll itself.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [current])

  // Screen visits (home, style, list, detail, contest, chance).
  useEffect(() => {
    trackScreen(current.name)
  }, [current.name])

  switch (current.name) {
    case 'home':
      return <HomePage />
    case 'style':
      return <StylePage />
    case 'list':
      return <ListPage />
    case 'detail':
      return <DetailPage />
    case 'contest':
      return <ContestPage />
    case 'chance':
      return <ChancePage />
    default:
      return <HomePage />
  }
}

export default function App() {
  return (
    <>
      <CurrentPage />
      {/* Persistent controls, fixed on every screen so they never remount/jump
          on navigation: language top-right, day/night bottom-right. */}
      <LangToggle />
      <ThemeToggle />
    </>
  )
}
