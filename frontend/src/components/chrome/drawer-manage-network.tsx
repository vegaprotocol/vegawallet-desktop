import { DrawerPanel } from '../../contexts/global/global-context'
import { Button } from '../button'
import { NetworkPresets } from '../network-presets'

interface DrawerManageNetworkProps {
  setView: (panel: DrawerPanel) => void
  setSelectedNetwork: (network: string) => void
}

export function DrawerManageNetwork({
  setView,
  setSelectedNetwork
}: DrawerManageNetworkProps) {
  return (
    <div>
      <NetworkPresets
        setEditView={setSelectedNetwork}
      />
      <div style={{ margin: '24px 0' }}>
        <Button
          data-testid='add-network'
          onClick={() => setView(DrawerPanel.Add)}
        >
          Add network
        </Button>
      </div>
    </div>
  )
}
