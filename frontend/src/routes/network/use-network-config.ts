import React from 'react'
import { GetNetworkConfig } from '../../api/service'
import { Network } from '../../models/network'

export function useNetworkConfig(name: string) {
  const [config, setConfig] = React.useState<Network | null>(null)

  React.useEffect(() => {
    const run = async () => {
      try {
        const res = await GetNetworkConfig(name)
        setConfig(res)
      } catch (err) {
        console.log(err)
      }
    }

    run()
  }, [name])

  return config
}
