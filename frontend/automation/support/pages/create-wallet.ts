import { expect, Locator, Page } from '@playwright/test'

export class CreateWallet {
  readonly goToCreateWalletButton: Locator
  readonly viewWalletButton: Locator
  readonly walletsHeader: Locator
  readonly page: Page
  readonly nameField: Locator
  readonly passphraseField: Locator
  readonly passphraseConfirmationField: Locator
  readonly submitButton: Locator
  readonly toast: Locator

  constructor(page: Page) {
    this.page = page
    this.nameField = page.getByTestId('create-wallet-form-name')
    this.passphraseField = page.getByTestId('create-wallet-form-passphrase')
    this.passphraseConfirmationField = page.getByTestId(
      'create-wallet-form-passphrase-confirm'
    )
    this.submitButton = page.getByTestId('create-wallet-form-submit')
    this.toast = page.getByTestId('toast')
    this.goToCreateWalletButton = page.getByTestId('create-new-wallet')
    this.viewWalletButton = page.getByTestId('create-wallet-success-cta')
  }

  async createWallet(username: string, passphrase: string) {
    await this.nameField.type(username)
    await this.passphraseField.type(passphrase)
    await this.passphraseConfirmationField.type(passphrase)
    await this.submitButton.click()
  }

  async goToViewWalletPage() {
    await this.viewWalletButton.click()
  }

  async checkToastSuccess() {
    await expect(this.toast).toHaveText('Wallet created!')
    await expect(this.toast).toBeHidden()
  }

  async createRandomWalletName() {
    const randomNum = Math.floor(Math.random() * 101)
    return `Test ${randomNum.toString()}`
  }
}
