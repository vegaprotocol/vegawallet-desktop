import { Button } from '../button'
import { NetworkPresets } from '../network-presets'
import type { DrawerViews } from './drawer-content'

interface DrawerManageNetworkProps {
  setView: React.Dispatch<React.SetStateAction<DrawerViews>>
  setSelectedNetwork: React.Dispatch<React.SetStateAction<string | null>>
}

export function DrawerManageNetwork({
  setView,
  setSelectedNetwork
}: DrawerManageNetworkProps) {
  return (
    <div>
      <NetworkPresets
        setEditView={() => setView('edit')}
        setSelectedNetwork={setSelectedNetwork}
      />
      <div style={{ margin: '24px 0' }}>
        <Button data-testid='add-network' onClick={() => setView('add')}>
          Add network
        </Button>
      </div>
    </div>
  )
}
