import React from 'react'

import { createLogger } from '../../lib/logging'
import { Service } from '../../service'
import type { network as NetworkModel } from '../../wailsjs/go/models'

const logger = createLogger('NetworkConfigContainer')

interface NetworkConfigContainerProps {
  children: (config: NetworkModel.Network) => React.ReactElement
  name: string | null
}

export function NetworkConfigContainer({
  children,
  name
}: NetworkConfigContainerProps) {
  const { config, loading } = useNetworkConfig(name)

  if (loading) {
    return null
  }

  if (!config) {
    return <p>No network configuration found. </p>
  }

  return children(config)
}

export function useNetworkConfig(name: string | null) {
  const [config, setConfig] = React.useState<NetworkModel.Network | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const run = async () => {
      if (!name) return
      setLoading(true)
      try {
        const res = await Service.GetNetworkConfig(name)
        setConfig(res)
      } catch (err) {
        setError(err as Error)
        logger.error(err)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [name])

  return { config, error, loading }
}
