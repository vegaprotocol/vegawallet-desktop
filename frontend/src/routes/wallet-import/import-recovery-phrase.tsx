import React from 'react'
import { useHistory } from 'react-router-dom'
import { Header } from '../../components/header'
import { WalletImportForm } from '../../components/wallet-import-form'
import { useImportWallet } from '../../hooks/use-import-wallet'
import { Paths } from '../router-config'

export const ImportRecoveryPhrase = () => {
  const history = useHistory()
  const { submit, response } = useImportWallet()

  React.useEffect(() => {
    if (response) {
      history.push(Paths.Wallet)
    }
  }, [response, history])

  return (
    <>
      <Header style={{ marginTop: 0 }}>Import wallet</Header>
      <WalletImportForm submit={submit} />
    </>
  )
}
