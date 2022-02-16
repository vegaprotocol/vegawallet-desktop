import React from 'react'

import { ExternalLink } from '../components/external-link'
import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'
import { Service } from '../service'

/**
 * Calls CheckVersion and shows a toast if theres a new version to update to
 */
export function useCheckForUpdate() {
  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await Service.CheckVersion()
        if (res instanceof Error) throw res
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

    run()
  }, [])
}
