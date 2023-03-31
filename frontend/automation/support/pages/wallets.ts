import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const wallets = (page: Page) => {
  const goToCreateWalletButton = page.getByTestId('create-new-wallet')
  const header = page.getByTestId('header-title')

  const goToCreateWalletPage = async () => await goToCreateWalletButton.click()
  const openWalletAndAssertName = async (walletName: string) => {
    await page.getByTestId(`wallet-${walletName.replace(' ', '-')}`).click()
    await expect(header).toHaveText(walletName)
  }
  return { goToCreateWalletPage, openWalletAndAssertName }
}
export default wallets
