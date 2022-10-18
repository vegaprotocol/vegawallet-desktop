import React from 'react'

import { useGlobal } from '../../contexts/global/global-context'
import { Button } from '../button'
import { ButtonUnstyled } from '../button-unstyled'
import { DropdownItem, DropdownMenu } from '../dropdown-menu'
import { DropdownArrow } from '../icons/dropdown-arrow'
import { NetworkInfo } from '../network-info'
import { Title } from '../title'
import type { DrawerViews } from './drawer-content'

interface DrawerNetworkProps {
  setView: React.Dispatch<React.SetStateAction<DrawerViews>>
}

export function DrawerNetwork({ setView }: DrawerNetworkProps) {
  const {
    state: { network, networks },
    actions,
    dispatch
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
                      onClick={() => {
                        dispatch(actions.changeNetworkAction(network))
                      }}
                    >
                      {network}
                    </ButtonUnstyled>
                  </DropdownItem>
                ))}
              </div>
            }
          />
          <ButtonUnstyled
            data-testid='manage-networks'
            onClick={() => setView('manage')}
          >
            Manage networks
          </ButtonUnstyled>
        </div>
      ) : (
        <div>
          <Button data-testid='import' onClick={() => setView('manage')}>
            Import
          </Button>
        </div>
      )}
      <NetworkInfo />
    </>
  )
}
