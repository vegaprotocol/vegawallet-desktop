import React, { KeyboardEvent } from 'react'
import { Colors } from '../../config/colors'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { useNetwork } from '../../contexts/network/network-context'
import { useService } from '../../contexts/service/service-context'
import { DropdownArrow } from '../icons/dropdown-arrow'
import { DropdownItem, DropdownMenu } from '../dropdown-menu'
import { Button } from '../button'
import {
  changeNetworkAction,
  updateNetworkConfigAction
} from '../../contexts/network/network-actions'
import { ExternalLink } from '../external-link'
import { DRAWER_HEIGHT } from '.'
import { NetworkImportForm } from '../network-import-form'
import { NetworkConfigContainer } from '../network-config-container'
import { NetworkConfigForm } from '../network-config-form'
import { stopServiceAction } from '../../contexts/service/service-actions'

export function ChromeDrawer() {
  const { state } = useGlobal()

  const transform = state.drawerOpen
    ? 'translateY(0)'
    : `translateY(${window.innerHeight - DRAWER_HEIGHT}px)`

  return (
    <div
      style={{
        background: Colors.DARK_GRAY_1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform,
        transition: 'transform .15s ease',
        fontSize: 14,
        overflowY: 'auto'
      }}>
      <DrawerHead height={DRAWER_HEIGHT} />
      {state.drawerOpen && <DrawerContent />}
    </div>
  )
}

interface DrawerHeadProps {
  height: number
}

/** The part of the drawer that remains exposed */
function DrawerHead({ height }: DrawerHeadProps) {
  const {
    state: { serviceRunning, serviceUrl }
  } = useService()
  const {
    state: { drawerOpen },
    dispatch: globalDispatch
  } = useGlobal()
  const {
    state: { network }
  } = useNetwork()
  return (
    <div
      style={{
        height,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0 10px 20px',
        borderBottom: `1px solid ${Colors.DARK_GRAY_3}`
      }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div>Network: {network ? network : 'None'}</div>
        <div>
          <StatusCircle running={serviceRunning} />
          {serviceRunning ? (
            <>Service running: {serviceUrl}</>
          ) : (
            <>Service not running</>
          )}
        </div>
      </div>
      <div>
        <ButtonUnstyled
          style={{ padding: 20 }}
          onClick={() => globalDispatch(setDrawerAction(!drawerOpen))}>
          <DropdownArrow
            style={{
              width: 16,
              height: 16,
              transform: drawerOpen ? '' : 'rotate(180deg)'
            }}
          />
        </ButtonUnstyled>
      </div>
    </div>
  )
}

export function StatusCircle({ running }: any) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-block',
    width: 11,
    height: 11,
    borderRadius: '50%',
    border: '2px solid white',
    marginRight: 5
  }
  const contextualStyles: React.CSSProperties = {
    background: running ? 'white' : 'transparent'
  }
  return <span style={{ ...baseStyles, ...contextualStyles }} />
}

type DrawerViews = 'network' | 'manage' | 'edit'

function DrawerContent() {
  const { dispatch } = useGlobal()
  const [view, setView] = React.useState<DrawerViews>('network')
  const [selectedNetwork, setSelectedNetwork] = React.useState<string | null>(
    null
  )

  // Close modal on escape key
  React.useEffect(() => {
    function handleKeydown(e: KeyboardEvent<HTMLDivElement>) {
      if (e.key === 'Escape') {
        dispatch(setDrawerAction(false))
      }
    }

    window.addEventListener('keydown', handleKeydown as any)

    return () => {
      window.removeEventListener('keydown', handleKeydown as any)
    }
  }, [dispatch])

  const renderView = () => {
    switch (view) {
      case 'network': {
        return <DrawerNetworkView setView={setView} />
      }
      case 'manage': {
        return (
          <DrawerManageView
            setView={setView}
            setSelectedNetwork={setSelectedNetwork}
          />
        )
      }
      case 'edit': {
        return (
          <DrawerEditView selectedNetwork={selectedNetwork} setView={setView} />
        )
      }
    }
  }

  return (
    <div style={{ padding: 20 }} onKeyDown={e => console.log(e)}>
      {renderView()}
    </div>
  )
}

interface DrawerNetworkViewProps {
  setView: React.Dispatch<React.SetStateAction<DrawerViews>>
}

function DrawerNetworkView({ setView }: DrawerNetworkViewProps) {
  const {
    state: { network, networks },
    dispatch: networkDispatch
  } = useNetwork()
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20
        }}>
        <DropdownMenu
          trigger={
            <Button
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 5,
                minWidth: 75
              }}>
              <span>{network}</span>
              <DropdownArrow
                style={{ width: 13, height: 13, marginLeft: 10 }}
              />
            </Button>
          }
          content={
            <div>
              {networks.map(network => (
                <DropdownItem key={network}>
                  <ButtonUnstyled
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      lineHeight: 1,
                      textAlign: 'left'
                    }}
                    onClick={() =>
                      networkDispatch(changeNetworkAction(network))
                    }>
                    {network}
                  </ButtonUnstyled>
                </DropdownItem>
              ))}
            </div>
          }
        />
        <ButtonUnstyled onClick={() => setView('manage')}>
          Manage networks
        </ButtonUnstyled>
      </div>
      <NetworkInfo />
    </>
  )
}

interface DrawerManageViewProps {
  setView: React.Dispatch<React.SetStateAction<DrawerViews>>
  setSelectedNetwork: React.Dispatch<React.SetStateAction<string | null>>
}

function DrawerManageView({
  setView,
  setSelectedNetwork
}: DrawerManageViewProps) {
  const {
    state: { networks }
  } = useNetwork()
  return (
    <>
      <div>
        <ButtonUnstyled onClick={() => setView('network')}>Back</ButtonUnstyled>
      </div>
      <h2>Networks</h2>
      <ul>
        {networks.map(n => (
          <li
            key={n}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
            <span>{n}</span>
            <ButtonUnstyled
              onClick={() => {
                setSelectedNetwork(n)
                setView('edit')
              }}>
              Edit
            </ButtonUnstyled>
          </li>
        ))}
      </ul>
      <h2>Add a network</h2>
      <NetworkImportForm />
    </>
  )
}

function NetworkInfo() {
  const {
    state: { config }
  } = useNetwork()

  if (!config) {
    return null
  }

  return (
    <>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{config.Name}</td>
          </tr>
          <tr>
            <th>Log level</th>
            <td>{config.Level}</td>
          </tr>
          <tr>
            <th>Token expiry</th>
            <td>{config.TokenExpiry}</td>
          </tr>
          <tr>
            <th>Host</th>
            <td>{config.Host}</td>
          </tr>
          <tr>
            <th>Port</th>
            <td>{config.Port}</td>
          </tr>
        </tbody>
      </table>
      <h2>Console</h2>
      <table>
        <tbody>
          <tr>
            <th>URL</th>
            <td>
              <ExternalLink
                style={{ textDecoration: 'underline' }}
                href={`https://${config.Console.URL}`}>
                {config.Console.URL}
              </ExternalLink>
            </td>
          </tr>
          <tr>
            <th>Local port</th>
            <td>{config.Console.LocalPort}</td>
          </tr>
        </tbody>
      </table>
      <h2>gRPC Nodes</h2>
      <NodeList items={config.API.GRPC.Hosts} />
      <h2>GraphQL Nodes</h2>
      <NodeList items={config.API.GraphQL.Hosts} />
      <h2>REST Nodes</h2>
      <NodeList items={config.API.REST.Hosts} />
    </>
  )
}

interface NodeListProps {
  items: string[]
}

function NodeList({ items }: NodeListProps) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: 5 }} className='text-muted'>
          {item}
        </li>
      ))}
    </ul>
  )
}

interface DrawerEditViewProps {
  selectedNetwork: string | null
  setView: React.Dispatch<React.SetStateAction<DrawerViews>>
}

function DrawerEditView({ setView, selectedNetwork }: DrawerEditViewProps) {
  const { dispatch: dispatchService } = useService()
  const { dispatch: dispatchNetwork } = useNetwork()
  return (
    <NetworkConfigContainer name={selectedNetwork}>
      {config => (
        <NetworkConfigForm
          config={config}
          onSubmit={updatedConfig => {
            dispatchService(stopServiceAction())
            dispatchNetwork(updateNetworkConfigAction(updatedConfig))
          }}
        />
      )}
    </NetworkConfigContainer>
  )
}
