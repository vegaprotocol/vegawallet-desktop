import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { WalletPaths } from '.'
import { Header } from '../../components/header'
import { Button } from '../../components/button'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { getKeysAction } from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../router-config'

export const WalletList = () => {
  const history = useHistory()
  const {
    state: { wallets },
    dispatch
  } = useGlobal()

  function getKeys(wallet: string) {
    dispatch(getKeysAction(wallet, () => history.push(WalletPaths.Detail)))
  }

  return (
    <>
      <Header style={{ marginTop: 0 }}>Wallets</Header>
      {wallets.length ? (
        <ul className='wallet-list'>
          {wallets.map(wallet => (
            <li
              data-testid={wallet.name}
              key={wallet.name}
              style={{
                marginBottom: 10
              }}
            >
              <ButtonUnstyled
                className='link'
                onClick={() => getKeys(wallet.name)}
                style={{ color: 'inherit' }}
              >
                {wallet.name}
              </ButtonUnstyled>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <p>No wallets</p>
          <Link to={Paths.WalletImport}>
            <Button>Add / Import Wallet</Button>
          </Link>
        </>
      )}
    </>
  )
}
