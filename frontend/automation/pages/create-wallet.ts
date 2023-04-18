import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const createWallet = (page: Page) => {
  const locators = {
    nameField: page.getByTestId('create-wallet-form-name'),
    passphraseField: page.getByTestId('create-wallet-form-passphrase'),
    passphraseConfirmationField: page.getByTestId(
      'create-wallet-form-passphrase-confirm'
    ),
    submitButton: page.getByTestId('create-wallet-form-submit'),
    toast: page.getByTestId('toast'),
    viewWalletButton: page.getByTestId('create-wallet-success-cta')
  }
  return {
    locators,
    createWallet: async (username: string, passphrase: string) => {
      await locators.nameField.type(username)
      await locators.passphraseField.type(passphrase)
      await locators.passphraseConfirmationField.type(passphrase)
      await locators.submitButton.click()
    },
    goToViewWalletPage: async () => locators.viewWalletButton.click(),
    checkToastSuccess: async () => {
      await expect(locators.toast).toHaveText('Wallet created!')
      await expect(locators.toast).toBeHidden()
    },
  }
}
export default createWallet
export const createRandomWalletName = () =>
`Test ${Math.floor(Math.random() * 101).toString()}`