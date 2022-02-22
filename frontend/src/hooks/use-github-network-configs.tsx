import type { Endpoints } from '@octokit/types'
import * as Sentry from '@sentry/react'
import React from 'react'

import { AppToaster } from '../components/toaster'
import { Intent } from '../config/intent'

interface NetworkOption {
  name: string
  configFileUrl: string
}

type NetworkRepoResponse =
  Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']['data']

export function useGithubNetworkConfigs() {
  const [networkOptions, setNetworkOptions] = React.useState<
    NetworkOption[] | null
  >(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  // TODO: Fix anys
  React.useEffect(() => {
    const getNetworksRepo = async () => {
      setLoading(true)

      try {
        // Get contents of the repo
        const networkDirs: NetworkRepoResponse = await fetch(
          'https://api.github.com/repos/vegaprotocol/networks/contents'
        ).then(res => res.json())

        if (!Array.isArray(networkDirs)) {
          throw new Error('Expected networks repo to be an array')
        }

        // Filter, keeping only directories that dont start with '.'
        const networks = networkDirs.filter(content => {
          if (content.type !== 'dir') return false
          if (content.name.startsWith('.')) return false
          return true
        })

        // Get contents of each subdirectory
        const networksContents: NetworkRepoResponse[] = await Promise.all(
          networks.map(content => {
            console.log(content.url)
            return fetch(content.url).then(res => res.json())
          })
        )

        // Reduce each directory into a NetworkOption with name and raw download link
        const configFiles = networksContents.reduce(
          (arr, networkContent, i) => {
            const network = networks[i]

            if (Array.isArray(networkContent)) {
              const configFile = networkContent.find(
                (item: any) => item.name === `${network.name}.toml`
              )

              if (configFile?.download_url) {
                arr.push({
                  name: network.name,
                  configFileUrl: configFile.download_url
                })
              } else {
                Sentry.captureMessage(
                  `No .toml file found for network: ${network.name}`
                )
              }
            } else {
              Sentry.captureException('Network repo content is not an array')
            }

            return arr
          },
          [] as NetworkOption[]
        )

        setNetworkOptions(configFiles)
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
        AppToaster.show({
          message: 'Could not load network presets',
          intent: Intent.DANGER
        })
        Sentry.captureException(err)
      }
    }

    getNetworksRepo()
  }, [])

  return { networkOptions, loading, error }
}
