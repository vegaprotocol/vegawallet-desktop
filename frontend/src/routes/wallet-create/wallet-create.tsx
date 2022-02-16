import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { Header } from '../../components/header'
import { WalletCreateForm } from '../../components/wallet-create-form'
import { WalletCreateFormSuccess } from '../../components/wallet-create-form/wallet-create-form-success'
import { useCreateWallet } from '../../hooks/use-create-wallet'
import { Paths } from '../'

export const WalletCreate = () => {
  const navigate = useNavigate()
  const { response, submit } = useCreateWallet()

  return (
    <div style={{ padding: 20 }}>
      <Header style={{ marginTop: 0 }}>Create wallet</Header>
      {response ? (
        <WalletCreateFormSuccess
          response={response}
          callToAction={
            <Button onClick={() => navigate(Paths.Wallet)}>View wallet</Button>
          }
        />
      ) : (
        <WalletCreateForm
          submit={submit}
          cancel={() => navigate(Paths.Wallet)}
        />
      )}
    </div>
  )
}
