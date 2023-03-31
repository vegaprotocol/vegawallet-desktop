import { expect, Locator, Page } from '@playwright/test'

export class NetworkTab {
  readonly expandNetworkTabButton: Locator
  readonly selectNetworkButton: Locator
  readonly availableNetworks: Locator
  readonly page: Page

  constructor(page: Page) {
    this.page = page
    this.expandNetworkTabButton = page.getByTestId('network-drawer')
    this.selectNetworkButton = page.getByTestId('network-select')
    this.availableNetworks = page.getByRole('menuitem')
  }

  async openNetworkTabAndViewNetworks() {
    await this.expandNetworkTabButton.click()
    await this.selectNetworkButton.click()
  }

  async checkExpectedNetworksAvailable(expectedNetworks: string[]) {
    const options = await this.availableNetworks.allInnerTexts()
    expect(options).toEqual(expectedNetworks)
  }
}
