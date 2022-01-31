import React from 'react'
import { useNetwork } from '../../contexts/network/network-context'
import { BulletList, BulletListItem } from '../bulle-list'
import { ButtonUnstyled } from '../button-unstyled'
import { NetworkImportForm } from '../network-import-form'
import { DrawerViews } from './drawer-content'

interface DrawerManageNetworkProps {
  setView: React.Dispatch<React.SetStateAction<DrawerViews>>
  setSelectedNetwork: React.Dispatch<React.SetStateAction<string | null>>
}

export function DrawerManageNetwork({
  setView,
  setSelectedNetwork
}: DrawerManageNetworkProps) {
  const {
    state: { networks }
  } = useNetwork()
  return (
    <>
      <h2>Networks</h2>
      <BulletList>
        {networks.map(n => (
          <BulletListItem
            key={n}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}>
            <span>{n}</span>
            <ButtonUnstyled
              onClick={() => {
                setSelectedNetwork(n)
                setView('edit')
              }}
              style={{ marginLeft: 'auto' }}>
              Edit
            </ButtonUnstyled>
          </BulletListItem>
        ))}
      </BulletList>
      <h2>Add a network</h2>
      <NetworkImportForm />
    </>
  )
}
