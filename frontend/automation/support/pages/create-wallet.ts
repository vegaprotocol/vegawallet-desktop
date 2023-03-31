import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const createWallet = (page: Page) => {
  const nameField = page.getByTestId('create-wallet-form-name')
  const passphraseField = page.getByTestId('create-wallet-form-passphrase')
  const passphraseConfirmationField = page.getByTestId(
    'create-wallet-form-passphrase-confirm'
  )
  const submitButton = page.getByTestId('create-wallet-form-submit')
  const toast = page.getByTestId('toast')
  const viewWalletButton = page.getByTestId('create-wallet-success-cta')

  async function createWallet(username: string, passphrase: string) {
    await nameField.type(username)
    await passphraseField.type(passphrase)
    await passphraseConfirmationField.type(passphrase)
    await submitButton.click()
  }

  async function goToViewWalletPage() {
    await viewWalletButton.click()
  }

  async function checkToastSuccess() {
    await expect(toast).toHaveText('Wallet created!')
    await expect(toast).toBeHidden()
  }

  async function createRandomWalletName() {
    const randomNum = Math.floor(Math.random() * 101)
    return `Test ${randomNum.toString()}`
  }
  return {
    createWallet,
    goToViewWalletPage,
    checkToastSuccess,
    createRandomWalletName
  }
}
export default createWallet
