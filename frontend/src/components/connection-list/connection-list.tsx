import { useCallback, useState } from 'react'

import { Colors } from '../../config/colors'
import type { Wallet } from '../../contexts/global/global-context'
import { DisconnectDialog } from './connection-disconnect-dialog'
import { ConnectionItem } from './connection-item'
import { ManageDialog } from './connection-manage-dialog'

type ConnectionListProps = {
  wallet: Wallet
}

export const ConnectionList = ({ wallet }: ConnectionListProps) => {
  const [disconnectHost, setDisconnectHost] = useState<string | null>(null)
  const [manageHost, setManageHost] = useState<string | null>(null)
  const connectionList = Object.keys(wallet.connections || {})

  const handleCloseDisconnect = useCallback(() => {
    setDisconnectHost(null)
  }, [setDisconnectHost])

  const handleCloseManage = useCallback(() => {
    setManageHost(null)
  }, [setManageHost])

  return (
    <div
      style={{
        borderBottom: connectionList.length ? `1px solid ${Colors.BLACK}` : ''
      }}
    >
      {connectionList.length === 0 && (
        <p style={{ margin: '20px 0' }}>No connections established.</p>
      )}
      {connectionList.map(key => (
        <>
          {wallet.connections && (
            <ConnectionItem
              connection={wallet.connections[key]}
              onManage={() => {}}
              onDisconnect={() => setDisconnectHost(key)}
            />
          )}
        </>
      ))}
      <DisconnectDialog
        isOpen={!!disconnectHost}
        wallet={wallet}
        hostname={disconnectHost ?? ''}
        onClose={handleCloseDisconnect}
      />
      <ManageDialog
        isOpen={!!manageHost}
        wallet={wallet}
        hostname={manageHost ?? ''}
        onClose={handleCloseManage}
      />
    </div>
  )
}
