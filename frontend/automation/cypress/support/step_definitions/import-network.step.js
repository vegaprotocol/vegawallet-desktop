import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import WalletPage from '../pages/wallets-page'
import NetworkDrawer from '../pages/network-drawer-page'
import path from 'path'
const walletPage = new WalletPage()
const networkDrawer = new NetworkDrawer()

Given('I am on the import network page', () => {
  cy.visit('#/wallet')
  walletPage.clickNetworkDrawer()
})

Given('I have an imported network', () => {
  cy.visit('#/wallet')
  walletPage.clickNetworkDrawer()
  const url = Cypress.env('mainnetConfigUrl')

  networkDrawer.ImportNetwork(url)
})

When('I import using valid network import url', () => {
  const url = Cypress.env('mainnetConfigUrl')

  networkDrawer.ImportNetwork(url)
})

When('I import using valid network import file path', () => {
  const filePath = path.join(
    Cypress.config('projectRoot'),
    'network-config/mainnet1.toml'
  )

  networkDrawer.ImportNetwork(filePath)
})

When('I import using invalid network import file path', () => {
  const invalidFilePath = './network-config/mainnet1'

  networkDrawer.ImportNetwork(invalidFilePath)
})

When('I import using unknown network import url', () => {
  const url =
    'https://githubusercontent.com/vegaprotocol/networks/master/mainnet1/fake.toml'

  networkDrawer.ImportNetwork(url)
})

When('I import using url and specify network name', () => {
  const url = Cypress.env('mainnetConfigUrl')
  const networkName = 'New Mainnet'

  networkDrawer.ImportNetwork(url, networkName)
})

Then('new network is added', () => {
  networkDrawer.verifyNetworkImportedSuccessfully()
  networkDrawer.clickBack()
})

Then('network is not added', () => {
  networkDrawer.verifyNetworkImportError()
})

Then('network page is populated as expected', () => {
  networkDrawer.verifyNetworkPage()
})

Then('file path error is displayed', () => {
  networkDrawer.verifyNetworkImportFilePathError()
})
