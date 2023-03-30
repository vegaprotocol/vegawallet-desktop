import { expect, Locator, Page } from '@playwright/test'

export class Wallets {
  readonly page: Page
  readonly goToCreateWalletButton: Locator
  readonly header: Locator

  constructor(page: Page) {
    this.page = page
    this.goToCreateWalletButton = page.getByTestId('create-new-wallet')
    this.header = this.page.getByTestId('header-title')
  }

  async goToCreateWalletPage() {
    await this.goToCreateWalletButton.click()
  }

  async openWalletAndAssertName(walletName: string) {
    await this.page
      .getByTestId(`wallet-${walletName.replace(' ', '-')}`)
      .click()
    await expect(this.header).toHaveText(walletName)
  }
}
