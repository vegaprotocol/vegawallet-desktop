import React from 'react'

import { changeNetworkAction } from '../../contexts/network/network-actions'
import { useNetwork } from '../../contexts/network/network-context'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { DropdownItem, DropdownMenu } from '../dropdown-menu'
import { Header } from '../header'
import { DropdownArrow } from '../icons/dropdown-arrow'
import { NetworkInfo } from '../network-info'
import type { DrawerViews } from './drawer-content'

interface DrawerNetworkProps {
  setView: React.Dispatch<React.SetStateAction<DrawerViews>>
}

export function DrawerNetwork({ setView }: DrawerNetworkProps) {
  const {
    state: { network, networks },
    dispatch: networkDispatch
  } = useNetwork()
  return (
    <>
      <Header style={{ marginTop: 0 }}>Network</Header>
      {networks.length ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}
        >
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
                      data-testid={`select-${network}`}
                      style={{
                        width: '100%',
                        padding: '10px 15px',
                        lineHeight: 1,
                        textAlign: 'left'
                      }}
                      onClick={() =>
                        networkDispatch(changeNetworkAction(network))
                      }
                    >
                      {network}
                    </ButtonUnstyled>
                  </DropdownItem>
                ))}
              </div>
            }
          />
          <ButtonUnstyled data-testid='manage-networks' onClick={() => setView('manage')}>
            Manage networks
          </ButtonUnstyled>
        </div>
      ) : (
        <div>
          <Button data-testid='import' onClick={() => setView('manage')}>Import</Button>
        </div>
      )}
      <NetworkInfo />
    </>
  )
}
