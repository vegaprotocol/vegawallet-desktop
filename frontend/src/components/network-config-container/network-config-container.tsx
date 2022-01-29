import React from 'react'
import { GetNetworkConfig } from '../../api/service'
import { Network } from '../../models/network'

interface NetworkConfigContainerProps {
  children: (config: Network) => React.ReactElement
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
    return (
      <>
        <p>No network configuration found. </p>
        <p>
          TODO: guide to import
          {/* <Link to={Paths.NetworkImport}>
            <Button>Import network</Button>
          </Link> */}
        </p>
      </>
    )
  }

  return children(config)
}

export function useNetworkConfig(name: string | null) {
  const [config, setConfig] = React.useState<Network | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const run = async () => {
      if (!name) return
      setLoading(true)
      try {
        const res = await GetNetworkConfig(name)
        setConfig(res)
      } catch (err) {
        console.log(err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [name])

  return { config, error, loading }
}
