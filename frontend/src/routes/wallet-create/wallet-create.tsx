import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { Header } from '../../components/header'
import { Splash } from '../../components/splash'
import { WalletCreateForm } from '../../components/wallet-create-form'
import { WalletCreateFormSuccess } from '../../components/wallet-create-form/wallet-create-form-success'
import { Colors } from '../../config/colors'
import { useCreateWallet } from '../../hooks/use-create-wallet'

export const WalletCreate = () => {
  const navigate = useNavigate()
  const { response, submit } = useCreateWallet()

  return (
    <Splash>
      <Header
        style={{ marginTop: 0, color: Colors.WHITE, textAlign: 'center' }}
      >
        Create wallet
      </Header>
      {response ? (
        <WalletCreateFormSuccess
          response={response}
          callToAction={
            <Button
              data-testid='create-wallet-success-cta'
              onClick={() => {
                const url = `/wallet/${response.wallet.name}/keypair/${response.key.publicKey}`
                navigate(url)
              }}
            >
              View wallet
            </Button>
          }
        />
      ) : (
        <WalletCreateForm submit={submit} cancel={() => navigate(-1)} />
      )}
    </Splash>
  )
}
