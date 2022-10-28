import { DrawerPanel, useGlobal } from '../../contexts/global/global-context'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { NetworkInfo } from '../network-info'
import { NetworkSwitcher } from '../network-switcher'
import { Title } from '../title'

interface DrawerNetworkProps {
  setView: (panel: DrawerPanel) => void
}

export function DrawerNetwork({ setView }: DrawerNetworkProps) {
  const {
    state: { networks }
  } = useGlobal()

  return (
    <>
      <Title style={{ marginTop: 0 }}>Network</Title>
      {networks.length ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          <NetworkSwitcher />
          <ButtonUnstyled
            data-testid='manage-networks'
            onClick={() => setView(DrawerPanel.Manage)}
          >
            Manage networks
          </ButtonUnstyled>
        </div>
      ) : (
        <div>
          <Button
            data-testid='import'
            onClick={() => setView(DrawerPanel.Manage)}
          >
            Import
          </Button>
        </div>
      )}
      <NetworkInfo />
    </>
  )
}
