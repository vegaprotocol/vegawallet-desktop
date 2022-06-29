import { Navigate, Outlet, useMatch, useParams } from 'react-router-dom'

import { Header } from '../../components/header'
import { useGlobal } from '../../contexts/global/global-context'
import { truncateMiddle } from '../../lib/truncate-middle'
import { Paths } from '..'

export const Wallet = () => {
  const match = useMatch('/wallet/:wallet')
  const { pubkey } = useParams<{ pubkey: string; wallet: string }>()
  const {
    state: { wallet }
  } = useGlobal()

  const renderTitle = () => {
    if (!wallet?.auth) {
      return 'No wallet selected'
    }

    if (wallet?.auth && !pubkey) {
      return 'No key selected'
    }

    if (wallet?.auth && pubkey) {
      return `${wallet.name} : ${truncateMiddle(pubkey)}`
    }

    throw new Error('Invalid state')
  }

  // If url is for selected keypair page but you haven't authenticated
  // redirect back to select wallet page
  if (match && !wallet?.auth) {
    return <Navigate to={Paths.Wallet} />
  }

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
          padding: 20
        }}
      >
        <Header style={{ margin: 0 }}>{renderTitle()}</Header>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
