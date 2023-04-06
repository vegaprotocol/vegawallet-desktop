import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const importWallet = (page: Page) => {
  const nameField = page.getByTestId('wallet-import-form-name')
  const passphraseField = page.getByTestId('wallet-import-form-passphrase')
  const recoveryPhraseField = page.getByTestId(
    'wallet-import-form-recovery-phrase'
  )
  const confirmPassphraseField = page.getByTestId(
    'wallet-import-form-passphrase-confirm'
  )
  const submitButton = page.getByTestId('wallet-import-form-submit')
  const toast = page.getByTestId('toast')
  const userInputRequiredText = page.getByTestId('helper-text')

  const importWallet = async (
    walletName: string,
    passphrase: string,
    recoveryPhrase: string,
    version = 2
  ) => {
    await nameField.type(walletName)
    await recoveryPhraseField.type(recoveryPhrase)
    await page.getByTestId('version').selectOption(String(version))
    await passphraseField.type(passphrase)
    await confirmPassphraseField.type(passphrase)
    await submitButton.click()
  }

  const expectToastToHaveText = async (text: string) => {
    await expect(toast).toHaveText(text)
    await toast.click()
  }

  const checkToastSuccess = async () => {
    await expectToastToHaveText('Wallet imported')
  }

  const checkToastShowsError = async () => {
    await expectToastToHaveText(
      'Error: could not import the wallet: the recovery phrase is not valid'
    )
    await toast.click()
  }

  const checkRequiredMessageAppears = async (expectedOccurences: number) => {
    await expect(userInputRequiredText).toHaveCount(expectedOccurences)
  }

  return {
    importWallet,
    checkToastSuccess,
    checkToastShowsError,
    checkRequiredMessageAppears,
    expectToastToHaveText
  }
}
export default importWallet
