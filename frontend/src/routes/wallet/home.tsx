import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { Header } from '../../components/header'
import { Title } from '../../components/title'
import { KeypairList } from '../../components/keypair-list'
import { ConnectionList } from '../../components/connection-list'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import { useCurrentWallet } from '../../hooks/use-current-wallet'

enum Tabs {
  KEYPAIRS = 'Keypairs',
  CONNECTIONS = 'Connections'
}

type TabTitlesProps = {
  activeTab: Tabs
  setTab: (tab: Tabs) => void
}

const TabTitles = ({ activeTab, setTab }: TabTitlesProps) => {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {Object.values(Tabs).map((tab) => (
        <Title
          key={tab}
          element='h2'
          onClick={() => setTab(tab)}
          style={{
            cursor: 'pointer',
            marginTop: 0,
            color: tab === activeTab
              ? Colors.WHITE
              : Colors.TEXT_COLOR_DEEMPHASISE,
          }}
        >
          {tab}
        </Title>
      ))}
    </div>
  )
}

export function WalletList() {
  const [tab, setTab] = useState<Tabs>(Tabs.KEYPAIRS)
  const navigate = useNavigate()
  const { actions, dispatch } = useGlobal()
  const { wallet } = useCurrentWallet()

  if (!wallet) {
    return <Navigate to='/' />
  }

  return (
    <>
      <Header
        title={wallet.name}
        breadcrumb='Wallets'
        onBack={() => {
          dispatch(actions.deactivateWalletAction(wallet.name))
          navigate('/')
        }}
      />
      <div style={{ padding: 20, paddingTop: 0 }}>
        <TabTitles activeTab={tab} setTab={setTab} />
        {tab === Tabs.KEYPAIRS && (
          <KeypairList
            wallet={wallet}
            onClick={(publicKey) => navigate(
              `/wallet/${encodeURIComponent(
                wallet.name
              )}/keypair/${publicKey}`
            )}
          />
        )}
        {tab === Tabs.CONNECTIONS && (
          <ConnectionList wallet={wallet} />
        )}
        <ButtonGroup orientation='vertical' style={{ padding: '20px 0' }}>
          {tab === Tabs.KEYPAIRS && (
            <Button
              data-testid='generate-keypair'
              onClick={() => {
                dispatch(actions.addKeypairAction(wallet.name))
              }}
            >
              Generate key pair
            </Button>
          )}
          <ButtonUnstyled
            onClick={() =>
              dispatch({ type: 'SET_REMOVE_WALLET_MODAL', open: true })
            }
            data-testid='remove-wallet'
          >
            Remove wallet
          </ButtonUnstyled>
        </ButtonGroup>
      </div>
    </>
  )
}
