import type { ReactNode } from 'react'
import { track } from '../analytics'

/**
 * Link to an Instagram profile that logs an `instagram_click` event with the
 * account and where it was clicked. `children` default to the `@account` tag.
 */
export default function IgLink({
  account,
  location,
  className,
  ariaLabel,
  children,
}: {
  /** Bare handle, no leading @ (e.g. 'neurokitsune'). */
  account: string
  /** Where the click happened: footer / detail / contest. */
  location: string
  className?: string
  ariaLabel?: string
  children?: ReactNode
}) {
  return (
    <a
      className={className}
      href={`https://instagram.com/${account}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      onClick={() => track('instagram_click', { account, location })}
    >
      {children ?? `@${account}`}
    </a>
  )
}
