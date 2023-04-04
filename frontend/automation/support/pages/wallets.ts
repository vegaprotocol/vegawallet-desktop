import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const wallets = (page: Page) => {
  const goToCreateWalletButton = page.getByTestId('create-new-wallet')
  const goToImportWalleButton = page.getByTestId('import-wallet')
  const header = page.getByTestId('header-title')
  const passphraseForm = page.getByTestId('passphrase-form')
  const passphraseField = page.getByTestId('input-passphrase')
  const submitPassphraseButton = page.getByTestId('input-submit')

  const goToCreateWalletPage = async () => await goToCreateWalletButton.click()
  const goToImportWalletPage = async () => await goToImportWalleButton.click()

  const openWallet = async (walletName: string, passphrase = '') => {
    await page.getByTestId(`wallet-${walletName.replace(' ', '-')}`).click()
    if (passphrase !== '') {
      authenticateWallet(passphrase)
    }
  }

  const openWalletAndAssertName = async (
    walletName: string,
    passphrase = ''
  ) => {
    await openWallet(walletName, passphrase)
    await expect(header).toHaveText(walletName)
  }

  const authenticateWallet = async (passphrase: string) => {
    await passphraseForm.waitFor({ state: 'visible' })
    await passphraseField.type(passphrase)
    await submitPassphraseButton.click()
  }

  return {
    goToCreateWalletPage,
    openWallet,
    openWalletAndAssertName,
    goToImportWalletPage
  }
}
export default wallets
