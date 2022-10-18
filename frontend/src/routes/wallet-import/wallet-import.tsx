import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Splash } from '../../components/splash'
import { Title } from '../../components/title'
import { WalletImportForm } from '../../components/wallet-import-form'
import { Colors } from '../../config/colors'
import { useImportWallet } from '../../hooks/use-import-wallet'
import { Paths } from '../'

export const WalletImport = () => {
  const navigate = useNavigate()
  const { submit, response } = useImportWallet()

  React.useEffect(() => {
    if (response) {
      const path = response.wallet?.name
        ? `/wallet/${encodeURIComponent(response.wallet?.name)}`
        : Paths.Home
      navigate(path)
    }
  }, [response, navigate])

  return (
    <Splash>
      <Title style={{ marginTop: 0, color: Colors.WHITE, textAlign: 'center' }}>
        Import wallet
      </Title>
      <WalletImportForm submit={submit} cancel={() => navigate(Paths.Home)} />
    </Splash>
  )
}
