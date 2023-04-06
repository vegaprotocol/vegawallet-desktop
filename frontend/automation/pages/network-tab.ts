import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

const networkTab = (page: Page) => {
  const locators = {
    expandNetworkTabButton: page.getByTestId('network-drawer'),
    selectNetworkButton: page.getByTestId('network-select'),
    availableNetworks: page.getByRole('menuitem')
  }
  return {
    openNetworkTabAndViewNetworks: async () => {
      await locators.expandNetworkTabButton.click()
      await locators.selectNetworkButton.click()
    },
    checkExpectedNetworksAvailable: async (expectedNetworks: string[]) => {
      const options = await locators.availableNetworks.allInnerTexts()
      expect(options).toEqual(expectedNetworks)
    }
  }
}
export default networkTab
