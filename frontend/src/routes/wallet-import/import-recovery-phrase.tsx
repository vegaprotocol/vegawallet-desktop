import React from 'react'
import { Header } from '../../components/header'
import { WalletImportForm } from '../../components/wallet-import-form'
import { useImportWallet } from '../../hooks/use-import-wallet'

export const ImportRecoveryPhrase = () => {
  const { submit } = useImportWallet()
  return (
    <>
      <Header style={{ marginTop: 0 }}>Import wallet</Header>
      <WalletImportForm submit={submit} />
    </>
  )
}
