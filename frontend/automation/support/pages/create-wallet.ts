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

  const createWallet = async (username: string, passphrase: string) => {
    await nameField.type(username)
    await passphraseField.type(passphrase)
    await passphraseConfirmationField.type(passphrase)
    await submitButton.click()
  }

  const goToViewWalletPage = async () => await viewWalletButton.click()

  const checkToastSuccess = async () => {
    await expect(toast).toHaveText('Wallet created!')
    await expect(toast).toBeHidden()
  }

  const createRandomWalletName = async () =>
    `Test ${Math.floor(Math.random() * 101).toString()}`

  return {
    createWallet,
    goToViewWalletPage,
    checkToastSuccess,
    createRandomWalletName
  }
}
export default createWallet
