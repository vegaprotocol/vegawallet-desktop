import '@vegaprotocol/wallet-ui/index.css'

import { App as WalletUI } from '@vegaprotocol/wallet-ui'
import { useMemo } from 'react'

import { useWailsLink } from './hooks/use-wails-link'
import { useWalletClient } from './hooks/use-wallet-client'
import { useWalletRuntime } from './hooks/use-wallet-runtime'
import { useWalletService } from './hooks/use-wallet-service'

const truthy = ['true', '1', 'yes', 'y', 'on']

const getNetworkMode = (mode: string) => {
  switch (mode) {
    case 'fairground':
    case 'mainnet':
    case 'dev': {
      return mode
    }
    default: {
      return undefined
    }
  }
}

function App() {
  useWailsLink()
  const service = useWalletService()
  const logger = useMemo(() => service.GetLogger('WalletClient'), [service])
  const client = useWalletClient(logger)
  const runtime = useWalletRuntime()

  return (
    <WalletUI
      client={client}
      runtime={runtime}
      service={service}
      features={{
        NETWORK_COMPATIBILITY_WARNING: truthy.includes(
          import.meta.env.VITE_FEATURE_NETWORK_WARNING
        ),
        TELEMETRY_CHECK: truthy.includes(
          import.meta.env.VITE_FEATURE_TELEMETRY_CHECK
        ),
        NETWORK_MODE: getNetworkMode(import.meta.env.VITE_FEATURE_MODE),
      }}
    />
  )
}

export default App
