import React from 'react'
import { useHistory } from 'react-router-dom'
import { WalletPaths } from '.'
import { BulletHeader } from '../../components/bullet-header'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { useBackend } from '../../contexts/backend/backend-context'
import { getKeysAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'

export const WalletList = () => {
  const history = useHistory()
  const service = useBackend()
  const {
    state: { wallets },
    dispatch
  } = useGlobal()

  function getKeys(wallet: string) {
    dispatch(
      getKeysAction(wallet, () => history.push(WalletPaths.Home), service)
    )
  }

  return (
    <>
      <BulletHeader tag='h1'>Wallets</BulletHeader>
      {wallets.length ? (
        <ul className='wallet-list'>
          {wallets.map(wallet => (
            <li
              key={wallet.name}
              style={{
                marginBottom: 10
              }}>
              <ButtonUnstyled
                className='link'
                onClick={() => getKeys(wallet.name)}>
                {wallet.name}
              </ButtonUnstyled>
            </li>
          ))}
        </ul>
      ) : (
        <p>No wallets</p>
      )}
    </>
  )
}
