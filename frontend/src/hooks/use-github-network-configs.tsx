import * as Sentry from '@sentry/react'
import React from 'react'

interface NetworkOption {
  name: string
  configFileUrl: string
}

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
        const networkDirs = await fetch(
          'https://api.github.com/repos/vegaprotocol/networks/contents'
        ).then(res => res.json())

        const networks = networkDirs.filter((content: any) => {
          if (content.type !== 'dir') return false
          if (content.name.startsWith('.')) return false
          return true
        })

        const networksContents = await Promise.all(
          networks.map((content: any) => {
            return fetch(content.url).then(res => res.json())
          })
        )

        const configFiles = networksContents.reduce(
          (arr, networkContent, i) => {
            const network = networks[i]
            const configFile = networkContent.find(
              (item: any) => item.name === `${network.name}.toml`
            )
            if (configFile) {
              arr.push({
                name: network.name,
                configFileUrl: configFile.download_url
              })
            }
            return arr
          },
          []
        )

        setNetworkOptions(configFiles)
        setLoading(false)
      } catch (err) {
        setError(err as Error)
        setLoading(false)
        Sentry.captureException(err)
      }
    }

    getNetworksRepo()
  }, [])

  return { networkOptions, loading, error }
}
