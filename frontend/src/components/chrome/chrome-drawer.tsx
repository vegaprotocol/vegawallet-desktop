import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Colors } from '../../config/colors'
import { setDrawerAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { ButtonUnstyled } from '../button-unstyled'
import { useNetwork } from '../../contexts/network/network-context'
import { useService } from '../../contexts/service/service-context'
import { DropdownArrow } from '../icons/dropdown-arrow'
import { DropdownItem, DropdownMenu } from '../dropdown-menu'
import { Button } from '../button'
import { NetworkDetails } from '../../routes/network/network-details'
import { changeNetworkAction } from '../../contexts/network/network-actions'
import { ExternalLink } from '../external-link'

export function ChromeDrawer() {
  const { state, dispatch } = useGlobal()

  const collapsedHeight = 70
  const transform = state.drawerOpen
    ? 'translateY(0)'
    : `translateY(${window.innerHeight - collapsedHeight}px)`

  return (
    <div
      style={{
        background: Colors.DARK_GRAY_5,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform,
        transition: 'transform .15s ease',
        fontSize: 14
      }}>
      <div>
        <DrawerHead height={collapsedHeight} />
        {state.drawerOpen && <DrawerContent />}
      </div>
    </div>
  )
}

interface DrawerHeadProps {
  height: number
}

/** The part of the drawer that remains exposed */
function DrawerHead({ height }: DrawerHeadProps) {
  const {
    state: { serviceRunning, serviceUrl, proxy, proxyUrl }
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

function DrawerContent() {
  const {
    state: { network, networks, config },
    dispatch: networkDispatch
  } = useNetwork()
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
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
        <ButtonUnstyled>Manage networks</ButtonUnstyled>
      </div>
      <NetworkInfo />
    </div>
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
