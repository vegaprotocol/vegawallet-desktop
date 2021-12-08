import React from 'react'
import { useHistory } from 'react-router-dom'
import { WalletPaths } from '.'
import { ListKeys } from '../../api/service'
import { BulletHeader } from '../../components/bullet-header'
import { ButtonUnstyled } from '../../components/button-unstyled'
import { requestPassphrase } from '../../components/passphrase-modal'
import { AppToaster } from '../../components/toaster'
import { Colors } from '../../config/colors'
import {
  changeWalletAction,
  setKeypairsAction
} from '../../contexts/global/global-actions'
import { useGlobal } from '../../contexts/global/global-context'

export const WalletList = () => {
  const history = useHistory()
  const {
    state: { wallets },
    dispatch
  } = useGlobal()

  async function getKeys(wallet: string) {
    const selectedWallet = wallets.find(w => w.name === wallet)

    if (selectedWallet?.keypairs) {
      dispatch(changeWalletAction(wallet))
      history.push(WalletPaths.Home)
    } else {
      try {
        const passphrase = await requestPassphrase()
        const keys = await ListKeys({
          wallet,
          passphrase
        })
        console.log(keys)
        dispatch(setKeypairsAction(wallet, keys.keys || []))
        history.push(WalletPaths.Home)
      } catch (err) {
        if (err !== 'dismissed') {
          AppToaster.show({ message: `Error: ${err}`, color: Colors.RED })
        }
      }
    }
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
