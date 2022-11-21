import '@vegaprotocol/wallet-ui/index.css'

import { App as WalletUI } from '@vegaprotocol/wallet-ui'
import { FeatureMap } from '@vegaprotocol/wallet-ui/src/types'
import { useMemo } from 'react'

import { useWailsLink } from './hooks/use-wails-link'
import { useWalletClient } from './hooks/use-wallet-client'
import { useWalletRuntime } from './hooks/use-wallet-runtime'
import { useWalletService } from './hooks/use-wallet-service'

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
        [FeatureMap.NETWORK_COMPATIBILITY_WARNING]: 'Cypress' in window,
      }}
    />
  )
}

export default App
