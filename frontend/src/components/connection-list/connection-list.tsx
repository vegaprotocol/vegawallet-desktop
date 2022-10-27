import { useCallback, useState, Fragment } from 'react'

import type { Wallet } from '../../contexts/global/global-context'
import { Colors } from '../../config/colors'
import { Dialog } from '../dialog'
import { Disconnect } from './connection-disconnect'
import { ConnectionItem } from './connection-item'
import { ManagePermissions } from './connection-manage'

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
        <Fragment key={key}>
          {wallet.connections && (
            <ConnectionItem
              connection={wallet.connections[key]}
              onManage={() => setManageHost(key)}
              onDisconnect={() => setDisconnectHost(key)}
            />
          )}
        </Fragment>
      ))}
      <Dialog
        open={!!disconnectHost}
        title='Disconnect site'
        onChange={() => setDisconnectHost(null)}
      >
        {disconnectHost && (
          <Disconnect
            wallet={wallet}
            hostname={disconnectHost}
            onClose={handleCloseDisconnect}
          />
        )}
      </Dialog>
      <Dialog
        open={!!manageHost}
        title='Update permissions'
        onChange={() => setManageHost(null)}
      >
        {manageHost && (
          <ManagePermissions
            wallet={wallet}
            hostname={manageHost}
            onClose={handleCloseManage}
          />
        )}
      </Dialog>
    </div>
  )
}
