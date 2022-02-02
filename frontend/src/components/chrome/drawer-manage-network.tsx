import React from 'react'
import { useNetwork } from '../../contexts/network/network-context'
import { BulletList, BulletListItem } from '../bulle-list'
import { ButtonUnstyled } from '../button-unstyled'
import { Header } from '../header'
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
      {networks.length ? (
        <>
          <Header style={{ marginTop: 0 }}>Networks</Header>
          <BulletList>
            {networks.map(n => (
              <BulletListItem
                key={n}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <span>{n}</span>
                <ButtonUnstyled
                  onClick={() => {
                    setSelectedNetwork(n)
                    setView('edit')
                  }}
                  style={{ marginLeft: 'auto' }}
                >
                  Edit
                </ButtonUnstyled>
              </BulletListItem>
            ))}
          </BulletList>
        </>
      ) : null}
      <Header style={{ marginTop: !networks.length ? 0 : undefined }}>
        Add a network
      </Header>
      <NetworkImportForm />
    </>
  )
}
