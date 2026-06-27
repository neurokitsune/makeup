import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LanguageProvider } from './i18n/LanguageContext'
import { ThemeProvider } from './theme/ThemeContext'
import { NavProvider } from './app/navigation'
import { ToastProvider } from './components/ToastContext'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <NavProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </NavProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
