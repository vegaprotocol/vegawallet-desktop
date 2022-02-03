import React from 'react'
import { useHistory } from 'react-router-dom'
import { Header } from '../../components/header'
import { WalletImportForm } from '../../components/wallet-import-form'
import { useImportWallet } from '../../hooks/use-import-wallet'
import { Paths } from '../router-config'

export const WalletImport = () => {
  const history = useHistory()
  const { submit, response } = useImportWallet()

  React.useEffect(() => {
    if (response) {
      history.push(Paths.Wallet)
    }
  }, [response, history])

  return (
    <div style={{ padding: 20 }}>
      <Header style={{ marginTop: 0 }}>Import wallet</Header>
      <WalletImportForm
        submit={submit}
        cancel={() => history.push(Paths.Wallet)}
      />
    </div>
  )
}
