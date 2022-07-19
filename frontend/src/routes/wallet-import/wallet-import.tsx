import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Header } from '../../components/header'
import { Splash } from '../../components/splash'
import { WalletImportForm } from '../../components/wallet-import-form'
import { Colors } from '../../config/colors'
import { useImportWallet } from '../../hooks/use-import-wallet'
import { Paths } from '../'

export const WalletImport = () => {
  const navigate = useNavigate()
  const { submit, response } = useImportWallet()

  React.useEffect(() => {
    if (response) {
      navigate(Paths.Home)
    }
  }, [response, navigate])

  return (
    <Splash>
      <Header
        style={{ marginTop: 0, color: Colors.WHITE, textAlign: 'center' }}
      >
        Import wallet
      </Header>
      <WalletImportForm submit={submit} cancel={() => navigate(Paths.Home)} />
    </Splash>
  )
}
