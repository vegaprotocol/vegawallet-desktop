import React from 'react'
import { Navigate } from 'react-router-dom'

import { useGlobal } from '../../contexts/global/global-context'
import { Paths } from '../'

/**
 * Redirects to import if no wallets are loaded, or to wallet home
 */
export const Home = () => {
  const {
    state: { wallets }
  } = useGlobal()

  if (wallets.length) {
    return <Navigate to={Paths.Wallet} />
  }

  return <Navigate to={Paths.WalletCreate} />
}
