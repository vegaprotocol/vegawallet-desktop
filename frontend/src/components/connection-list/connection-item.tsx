import { Colors } from '../../config/colors'
import type { Connection } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { StatusCircle } from '../status-circle'

type ConnectionItemProps = {
  connection: Connection
  onManage: () => void
  onDisconnect: () => void
}

export const ConnectionItem = ({
  connection,
  onManage,
  onDisconnect
}: ConnectionItemProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        padding: '20px 0',
        borderTop: `1px solid ${Colors.BLACK}`
      }}
    >
      <div
        style={{
          minWidth: 0,
          flexBasis: '50%'
        }}
      >
        <pre
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <StatusCircle
            blinking={connection.active}
            background={connection.active ? Colors.VEGA_GREEN : Colors.VEGA_RED}
          />
          {connection.hostname}
        </pre>
      </div>
      <div style={{ display: 'flex', gap: 20 }}>
        <ButtonUnstyled onClick={onManage}>Manage</ButtonUnstyled>
        <ButtonUnstyled style={{ display: 'none' }} onClick={onDisconnect}>Disconnect</ButtonUnstyled>
      </div>
    </div>
  )
}
