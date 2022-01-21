import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { GetNetworkConfig } from '../../api/service'
import { Button } from '../../components/button'
import { Network } from '../../models/network'
import { Paths } from '../router-config'

interface NetworkConfigContainerProps {
  children: (config: Network) => React.ReactElement
}

export function NetworkConfigContainer({
  children
}: NetworkConfigContainerProps) {
  const { config, loading } = useNetworkConfig()

  if (loading) {
    return null
  }

  if (!config) {
    return (
      <>
        <p>No network configuration found. </p>
        <p>
          <Link to={Paths.NetworkImport}>
            <Button>Import network</Button>
          </Link>
        </p>
      </>
    )
  }

  return children(config)
}

export function useNetworkConfig() {
  const { name } = useParams<{ name: string }>()
  const [config, setConfig] = React.useState<Network | null>(null)
  const [error, setError] = React.useState<Error | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const run = async () => {
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
