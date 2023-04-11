import type { Page } from '@playwright/test'

import createWallet from './create-wallet'
import importWallet from './import-wallet'
import networkTab from './network-tab'
import viewWallet from './view-wallet'
import wallets from './wallets'

const pages = (page: Page) => {
  const walletPage = wallets(page)
  const createWalletPage = createWallet(page)
  const importWalletPage = importWallet(page)
  const viewWalletPage = viewWallet(page)
  const network = networkTab(page)

  return {
    walletPage,
    createWalletPage,
    importWalletPage,
    viewWalletPage,
    network
  }
}

export default pages
