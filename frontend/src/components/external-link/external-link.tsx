import type { AnchorHTMLAttributes } from 'react'
import React from 'react'

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string // make href prop required
}

export function ExternalLink({ style, href, ...props }: ExternalLinkProps) {
  return (
    // ignore warning about no content
    // eslint-disable-next-line
    <a
      {...props}
      target='_blank'
      style={{ textDecoration: 'underline', cursor: 'pointer', ...style }}
      onClick={() => window.runtime.BrowserOpenURL(href)}
    />
  )
}
