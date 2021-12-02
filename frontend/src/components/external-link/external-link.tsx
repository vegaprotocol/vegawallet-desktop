import WailsRuntime from '@wailsapp/runtime'
import React from 'react'
import { AnchorHTMLAttributes } from 'react'

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string // make href prop required
}

export function ExternalLink(props: ExternalLinkProps) {
  return (
    <a {...props} onClick={() => WailsRuntime.Browser.OpenURL(props.href)} />
  )
}
