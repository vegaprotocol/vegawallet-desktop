import React from 'react'
import { Header } from '../../components/header'
import { WalletCreateForm } from '../../components/wallet-create-form'
import { useCreateWallet } from '../../hooks/use-create-wallet'
import { WalletCreateFormSuccess } from '../../components/wallet-create-form/wallet-create-form-success'
import { useHistory } from 'react-router-dom'
import { Paths } from '../router-config'
import { Button } from '../../components/button'

export const WalletCreate = () => {
  const history = useHistory()
  const { response, submit } = useCreateWallet()

  if (response) {
    return (
      <WalletCreateFormSuccess
        response={response}
        callToAction={
          <Button onClick={() => history.push(Paths.Wallet)}>
            View wallet
          </Button>
        }
      />
    )
  }

  return (
    <>
      <Header style={{ marginTop: 0 }}>Create wallet</Header>
      <WalletCreateForm
        submit={submit}
        cancel={() => history.push(Paths.Wallet)}
      />
    </>
  )
}
