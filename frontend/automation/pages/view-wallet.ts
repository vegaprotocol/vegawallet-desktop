import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const viewWallet = (page: Page) => {
  const locators = {
    goToWalletsButton: page.getByTestId('page-back'),
    walletsHeader: page.getByRole('heading', {level: 1})
  }
  return {
    goToWalletsPage: async () => locators.goToWalletsButton.click(),
    checkWalletExists: async (expectedWallet: string) =>
      expect(locators.walletsHeader).toHaveText(expectedWallet)
  }
}
export default viewWallet
