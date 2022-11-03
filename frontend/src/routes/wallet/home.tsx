import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '../../components/button'
import { ButtonGroup } from '../../components/button-group'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { ConnectionList } from '../../components/connection-list'
import { Header } from '../../components/header'
import { KeypairList } from '../../components/keypair-list'
import { Title } from '../../components/title'
import { RemoveWallet } from '../../components/remove-wallet'
import { Dialog } from '../../components/dialog'
import { WalletEdit } from '../../components/wallet-edit'
import { Colors } from '../../config/colors'
import { Edit } from '../../components/icons/edit'
import { Trash } from '../../components/icons/trash'
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
      {Object.values(Tabs).map(tab => (
        <Title
          key={tab}
          element='h2'
          onClick={() => setTab(tab)}
          style={{
            cursor: 'pointer',
            marginTop: 0,
            paddingBottom: 4,
            borderBottom: `2px solid ${
              tab === activeTab ? Colors.WHITE : 'transparent'
            }`,
            color:
              tab === activeTab ? Colors.WHITE : Colors.TEXT_COLOR_DEEMPHASISE
          }}
        >
          {tab}
        </Title>
      ))}
    </div>
  )
}

export function WalletList() {
  const [isEditing, setEditing] = useState(false)
  const [isRemoving, setRemoving] = useState(false)
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
        title={(
          <>
            {wallet.name}
            <ButtonGroup
              inline
              style={{
                display: 'inline-flex',
                marginLeft: 20,
                gap: 12
              }}
            >
              <ButtonUnstyled
                style={{ textDecoration: 'none' }}
                onClick={() => setEditing(true)}
              >
                <Edit style={{ width: 20 }} />
              </ButtonUnstyled>
              <ButtonUnstyled
                style={{ textDecoration: 'none' }}
                onClick={() => setRemoving(true)}
              >
                <Trash style={{ width: 20 }} />
              </ButtonUnstyled>
            </ButtonGroup>
          </>
        )}
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
            onClick={publicKey =>
              navigate(
                `/wallet/${encodeURIComponent(
                  wallet.name
                )}/keypair/${publicKey}`
              )
            }
          />
        )}
        {tab === Tabs.CONNECTIONS && <ConnectionList wallet={wallet} />}
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
      </div>
      <Dialog
        size='lg'
        open={isRemoving}
        title='Remove wallet'
      >
        <RemoveWallet onClose={() => setRemoving(false)} />
      </Dialog>
      <Dialog
        open={isEditing}
        onChange={setEditing}
        title="Edit wallet"
      >
        <WalletEdit onClose={() => setEditing(false)} />
      </Dialog>
    </>
  )
}
