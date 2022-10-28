import { useState, useMemo, useCallback } from 'react'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { DropdownItem, DropdownMenu } from '../dropdown-menu'
import { DropdownArrow } from '../icons/dropdown-arrow'
import { ConnectionsWarningDialog } from './connections-warning-dialog'
import { Colors } from '../../config/colors'
import { useGlobal } from '../../contexts/global/global-context'
import type { Wallet } from '../../contexts/global/global-context'

const findActiveConnections = (wallets: Record<string, Wallet>) => {
  return Object.keys(wallets).reduce<string[]>((acc, walletName) => {
    const connections = wallets[walletName].connections || {}
    const hosts = Object.keys(connections)
    if (hosts.find(host => connections[host].active)) {
      acc.push(walletName)
    }
    return acc
  }, [])
}

export const NetworkSwitcher = () => {
  const {
    state,
    actions,
    dispatch
  } = useGlobal()
  const [hasConnectionWarning, setConnectionWarning] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState(state.network)
  const activeConnections = useMemo(() => (
    findActiveConnections(state.wallets)
  ), [state.wallets])

  console.log(activeConnections)

  const handleNetworkChange = useCallback((network: string) => {
    if (activeConnections.length) {
      setSelectedNetwork(network)
      setConnectionWarning(true)
      return
    }
    dispatch(actions.changeNetworkAction(network))
  }, [dispatch, actions, activeConnections])

  const handleConfirm = useCallback(() => {
    if (selectedNetwork) {
      dispatch(actions.changeNetworkAction(selectedNetwork))
    }
  }, [dispatch, actions, selectedNetwork])

  return (
    <>
      <DropdownMenu
        trigger={
          <Button
            data-testid='network-select'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 5,
              minWidth: 75
            }}
          >
            <span>{state.network}</span>
            <DropdownArrow
              style={{ width: 13, height: 13, marginLeft: 10 }}
            />
          </Button>
        }
        content={
          <div>
            {state.networks.map(network => (
              <DropdownItem key={network}>
                <ButtonUnstyled
                  data-testid={`select-${network}`}
                  style={{
                    width: '100%',
                    padding: '10px 15px',
                    lineHeight: 1,
                    textAlign: 'left',
                    color: network === selectedNetwork ? Colors.TEXT_COLOR_DEEMPHASISE : Colors.WHITE,
                  }}
                  onClick={() => {
                    handleNetworkChange(network)
                  }}
                >
                  {network}
                </ButtonUnstyled>
              </DropdownItem>
            ))}
          </div>
        }
      />
      <ConnectionsWarningDialog
        activeConnections={activeConnections}
        isOpen={hasConnectionWarning}
        setOpen={setConnectionWarning}
        onConfirm={handleConfirm}
      />
    </>
  )
}
