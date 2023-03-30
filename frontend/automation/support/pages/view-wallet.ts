import { expect, Locator, Page } from '@playwright/test'

export class ViewWallet {
  readonly page: Page
  readonly goToWalletsButton: Locator
  readonly walletsHeader: Locator

  constructor(page: Page) {
    this.page = page
    this.goToWalletsButton = page.getByTestId('back')
    this.walletsHeader = page.getByTestId('header-title')
  }

  async goToWalletsPage() {
    await this.goToWalletsButton.click()
  }

  async checkWalletExists(expectedWallet: string) {
    await expect(this.walletsHeader).toHaveText(expectedWallet)
  }
}
