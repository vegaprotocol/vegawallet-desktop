import { useNavigate, useParams } from 'react-router-dom'

import { ButtonUnstyled } from '../../../components/button-unstyled'
import { Header } from '../../../components/header'
import { PublicKey } from '../../../components/public-key'
import { Title } from '../../../components/title'
import { TransactionHistory } from '../../../components/transaction-history'
import { Colors } from '../../../config/colors'
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
        left={
          <ButtonUnstyled
            style={{ marginRight: 10, marginTop: 4, textDecoration: 'none' }}
            onClick={() => {
              navigate(`/wallet/${wallet}/keypair/${pubkey}`)
            }}
          >
            {'< Key'}
          </ButtonUnstyled>
        }
        center={
          <div
            style={{
              color: Colors.WHITE,
              fontSize: 20
            }}
          >
            Transactions
          </div>
        }
      />
      <PublicKey keypair={keypair} />
      <div style={{ padding: 20 }} data-testid='keypair-home'>
        <Title>History</Title>
        <TransactionHistory />
      </div>
    </>
  )
}
