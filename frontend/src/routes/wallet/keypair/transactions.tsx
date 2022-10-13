import { useNavigate, useParams } from 'react-router-dom'

import { Header } from '../../../components/header'
import { PublicKey } from '../../../components/public-key'
import { Title } from '../../../components/title'
import { TransactionHistory } from '../../../components/transaction-history'
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
      <PublicKey keypair={keypair} />
      <div style={{ padding: 20, paddingTop: 0 }} data-testid='keypair-home'>
        <Title>History</Title>
        <TransactionHistory />
      </div>
    </>
  )
}
