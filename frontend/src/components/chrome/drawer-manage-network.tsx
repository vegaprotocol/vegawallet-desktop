import React from 'react'
import { useNetwork } from '../../contexts/network/network-context'
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
