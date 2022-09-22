import React from 'react'

import type { WalletModel } from '../../wallet-client'
import { useGlobal } from '../../contexts/global/global-context'
import { createLogger } from '../../lib/logging'

const logger = createLogger('NetworkConfigContainer')

interface NetworkConfigContainerProps {
  children: (config: WalletModel.DescribeNetworkResponse) => React.ReactElement
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
  const { service } = useGlobal()
  const [config, setConfig] = React.useState<WalletModel.DescribeNetworkResponse | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const run = async () => {
      if (!name) return
      setLoading(true)
      try {
        const res = await service.WalletApi.DescribeNetwork(name)
        setConfig(res)
      } catch (err) {
        setError(err as Error)
        logger.error(err)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [name, service])

  return { config, error, loading }
}
