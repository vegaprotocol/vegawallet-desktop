import { useNavigate, useParams } from 'react-router-dom'

import { Header } from '../../../components/header'
import { PublicKey } from '../../../components/public-key'
import { Title } from '../../../components/title'
import { TransactionHistory } from '../../../components/transaction-history'
import { ButtonUnstyled } from '../../../components/button-unstyled'
import { ArrowTopRight } from '../../../components/icons/arrow-top-right'
import { useCurrentKeypair } from '../../../hooks/use-current-keypair'

export function Transactions() {
  const navigate = useNavigate()
  const { wallet, pubkey } = useParams<{ wallet: string; pubkey: string }>()
  const { keypair } = useCurrentKeypair()

  if (!keypair) {
    return null
  }

  return (
    <>
      <Header
        title='Transactions'
        breadcrumb={keypair.name}
        onBack={() => {
          navigate(`/wallet/${wallet}/keypair/${pubkey}`)
        }}
      />
      <PublicKey publicKey={keypair.publicKey} />
      <div style={{ padding: 20, paddingTop: 0 }} data-testid='keypair-home'>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Title>Current session transactions</Title>
          <ButtonUnstyled>
            View full history
            <ArrowTopRight style={{ width: 13, marginLeft: 6 }}/>
          </ButtonUnstyled>
        </div>
        <TransactionHistory />
      </div>
    </>
  )
}
