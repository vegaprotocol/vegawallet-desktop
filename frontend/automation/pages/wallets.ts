import type { Page } from '@playwright/test'

const wallets = (page: Page) => {
  const locators = {
    goToCreateWalletButton: page.getByTestId('create-new-wallet'),
    goToImportWalleButton: page.getByTestId('import-wallet'),
    header: page.getByTestId('header-title'),
    passphraseForm: page.getByTestId('passphrase-form'),
    passphraseField: page.getByTestId('input-passphrase'),
    submitPassphraseButton: page.getByTestId('input-submit')
  }

  const goToCreateWalletPage = async () =>
    locators.goToCreateWalletButton.click()
  const goToImportWalletPage = async () =>
    await locators.goToImportWalleButton.click()

  const openWallet = async (walletName: string, passphrase = '') => {
    await page.getByTestId(`wallet-${walletName.replace(' ', '-')}`).click()
    if (passphrase !== '') {
      authenticateWallet(passphrase)
    }
  }

  const openWalletAndGetName = async (walletName: string, passphrase = '') => {
    await openWallet(walletName, passphrase)
    return await locators.header.innerText()
  }

  const authenticateWallet = async (passphrase: string) => {
    await locators.passphraseForm.waitFor({ state: 'visible' })
    await locators.passphraseField.type(passphrase)
    await locators.submitPassphraseButton.click()
  }

  return {
    goToImportWalletPage,
    goToCreateWalletPage,
    openWallet,
    openWalletAndGetName
  }
}
export default wallets
