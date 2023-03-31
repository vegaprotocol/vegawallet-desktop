import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const viewWallet = (page: Page) => {
  const goToWalletsButton = page.getByTestId('back')
  const walletsHeader = page.getByTestId('header-title')

  const goToWalletsPage = async () => await goToWalletsButton.click()

  const checkWalletExists = async (expectedWallet: string) =>
    await expect(walletsHeader).toHaveText(expectedWallet)

  return { goToWalletsPage, checkWalletExists }
}
export default viewWallet
