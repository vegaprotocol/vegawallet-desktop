import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import path from 'path'

import NetworkDrawer from '../pages/network-drawer-page'
import WalletPage from '../pages/wallets-page'

const walletPage = new WalletPage()
const networkDrawer = new NetworkDrawer()

Given('I open the network drawer', () => {
  cy.visit('#/wallet')
  walletPage.clickNetworkDrawer()
})

Given('I have an imported network', () => {
  cy.restoreWallet()
  cy.getByTestId('wallet-list').should('have.length', 1)
})

Given('I have downloaded network config file', () => {
  const url = Cypress.env('mainnetConfigUrl')
  cy.downloadFile(url, 'network-config', 'mainnet-config.toml')
})

When('I select {string} on the dropdown', networkName => {
  networkDrawer.clickImportBtn()
  networkDrawer.selectNetwork(networkName)
})

When('I import using valid network import url', () => {
  const url = Cypress.env('mainnetConfigUrl')

  networkDrawer.importNetworkUsingPath(url)
})

When('I import using valid network import file path', () => {
  const filePath = path.join(
    Cypress.config('projectRoot'),
    'network-config/mainnet-config.toml'
  )

  networkDrawer.importNetworkUsingPath(filePath, null, true)
})

When('I import using invalid network import file path', () => {
  const invalidFilePath = './network-config/mainnet1'

  networkDrawer.importNetworkUsingPath(invalidFilePath)
})

When('I import using unknown network import url', () => {
  const url =
    'https://githubusercontent.com/vegaprotocol/networks/master/mainnet1/fake.toml'

  networkDrawer.importNetworkUsingPath(url)
})

When('I import using url and specify network name', () => {
  const url = Cypress.env('mainnetConfigUrl')
  const networkName = 'New Mainnet'

  networkDrawer.importNetworkUsingPath(url, networkName)
})

When('overwrite is clicked', () => {
  networkDrawer.clickOverwrite()
})

When('Import is clicked', () => {
  networkDrawer.clickImportBtn()
})

Then('new network is added', () => {
  networkDrawer.verifyNetworkImportedSuccessfully()
  networkDrawer.clickBack()
})

Then('network is not added', () => {
  networkDrawer.verifyNetworkImporturlError()
})

Then('network with same name error is shown', () => {
  networkDrawer.verifyNetworkSameNameError()
})

Then('network page is populated with {string} as expected', expectedNetwork => {
  networkDrawer.validateNetworkPage(expectedNetwork)
})

Then('file path error is displayed', () => {
  networkDrawer.verifyNetworkImportFilePathError()
})
