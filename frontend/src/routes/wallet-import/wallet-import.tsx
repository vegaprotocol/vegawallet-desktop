import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Header } from '../../components/header'
import { WalletImportForm } from '../../components/wallet-import-form'
import { useImportWallet } from '../../hooks/use-import-wallet'
import { Paths } from '../'

export const WalletImport = () => {
  const navigate = useNavigate()
  const { submit, response } = useImportWallet()

  React.useEffect(() => {
    if (response) {
      navigate(Paths.Wallet)
    }
  }, [response, navigate])

  return (
    <div style={{ padding: 20 }}>
      <Header style={{ marginTop: 0 }}>Import wallet</Header>
      <WalletImportForm submit={submit} cancel={() => navigate(Paths.Wallet)} />
    </div>
  )
}
