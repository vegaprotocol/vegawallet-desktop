import React from 'react'

import { useGlobal } from '../contexts/global/global-context'
import { ExternalLink } from '../components/external-link'
import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'

/**
 * Calls CheckVersion and shows a toast if theres a new version to update to
 */
export function useCheckForUpdate() {
  const { service } = useGlobal()
  
  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await service.CheckVersion()

        // if string is empty no version to update to
        if (res) {
          AppToaster.show({
            message: (
              <>
                Version {res.version} is now available on{' '}
                <ExternalLink href={res.releaseUrl}>Github</ExternalLink>
              </>
            ),
            timeout: 0,
            intent: Intent.PRIMARY
          })
        }
      } catch (err) {
        // No op
      }
    }

    // Dont show the update toast when running cypress to avoid colli
    if (!('Cypress' in window)) {
      run()
    }
  }, [])
}
