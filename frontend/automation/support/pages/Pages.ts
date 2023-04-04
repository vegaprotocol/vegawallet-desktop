import type { Locator, Page } from '@playwright/test'

import createWallet from './create-wallet'
import importWallet from './import-wallet'
import viewWallet from './view-wallet'
import wallets from './wallets'

export class Pages {
  readonly createWalletPage: ReturnType<typeof createWallet>
  readonly importWalletPage: ReturnType<typeof importWallet>
  readonly viewWalletPage: ReturnType<typeof viewWallet>
  readonly walletPage: ReturnType<typeof wallets>

  constructor(public page: Page) {
    this.createWalletPage = createWallet(page)
    this.importWalletPage = importWallet(page)
    this.viewWalletPage = viewWallet(page)
    this.walletPage = wallets(page)
  }
}
