import React from 'react'
import { Redirect } from 'react-router-dom'
import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../router-config'

/**
 * Redirects to import if no wallets are loaded, or to wallet home
 */
export const Home = () => {
  const {
    state: { wallets }
  } = useGlobal()

  if (wallets.length) {
    return <Redirect to={Paths.Wallet} />
  }

  return <Redirect to={Paths.WalletImport} />
}
