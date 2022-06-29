import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { ButtonUnstyled } from '../../components/button-unstyled'
import { Header } from '../../components/header'
import { useGlobal } from '../../contexts/global/global-context'
import { truncateMiddle } from '../../lib/truncate-middle'

export const Wallet = () => {
  const navigate = useNavigate()
  const { pubkey } = useParams<{ pubkey: string; wallet: string }>()
  const {
    state: { wallet }
  } = useGlobal()

  const renderTitle = () => {
    if (!wallet?.auth) {
      return 'No wallet selected'
    }

    if (wallet?.name && pubkey) {
      return `${wallet.name} : ${truncateMiddle(pubkey)}`
    }

    if (wallet?.name) {
      return wallet.name
    }

    throw new Error('Invalid state')
  }

  // Wallet page doesnt have any consistent UI shared amongs child pages so just render the <Outlet />
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'min-content 1fr',
        height: '100%'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 20
        }}
      >
        <Header style={{ margin: 0 }}>{renderTitle()}</Header>
        <ButtonUnstyled onClick={() => navigate(-1)}>Back</ButtonUnstyled>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
