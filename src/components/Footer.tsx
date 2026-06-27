import { useLang } from '../i18n/LanguageContext'
import IgLink from './IgLink'

/** Credit line shown at the bottom of every page; "neurokitsune" links to Instagram. */
export default function Footer() {
  const { t } = useLang()
  const [before, after] = t('madeBy').split('neurokitsune')
  return (
    <footer className="page-footer">
      {before}
      <IgLink account="neurokitsune" location="footer" className="page-footer__link">
        neurokitsune
      </IgLink>
      {after}
    </footer>
  )
}
