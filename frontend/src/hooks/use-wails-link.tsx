import { useEffect } from 'react'

import { BrowserOpenURL } from '../wailsjs/runtime'

const getAnchor = (element: HTMLElement | null): HTMLAnchorElement | null => {
  if (element?.nodeName.toLocaleLowerCase() === 'a') {
    return element as HTMLAnchorElement
  }

  if (element?.parentNode?.nodeName.toLowerCase() === 'a') {
    return element.parentNode as HTMLAnchorElement
  }

  return null
}

export const useWailsLink = () => {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      var anchor = getAnchor(event.target as HTMLElement | null)
      var url = anchor?.getAttribute('href')

      if (url && anchor?.nodeName.toLocaleLowerCase() === 'a') {
        BrowserOpenURL(url)
      }
    }
    document.body.addEventListener('click', handler)

    return () => document.body.removeEventListener('click', handler)
  }, [])
}
