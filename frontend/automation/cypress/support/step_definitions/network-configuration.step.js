import '../cleanup'

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

import EditNetworkPage from '../pages/edit-network-page'
import NetworkDrawer from '../pages/network-drawer-page'
import WalletPage from '../pages/wallets-page'
const walletPage = new WalletPage()
const networkDrawer = new NetworkDrawer()
const editNetworkPage = new EditNetworkPage()

Given('I am on the Network configuration page', () => {
  cy.visit('#/wallet')
  walletPage.clickNetworkDrawer()
})

Given('I have more than one imported network', () => {
  cy.visit('#/wallet')
  walletPage.clickNetworkDrawer()
  networkDrawer.ImportNetworkUsingPath(Cypress.env('mainnetConfigUrl'))
  networkDrawer.closeToast()
  networkDrawer.navigateBackToNetworkConfigPage()
  networkDrawer.ImportNetworkUsingPath(Cypress.env('testnetConfigUrl'))
  networkDrawer.closeToast()
  networkDrawer.navigateBackToNetworkConfigPage()
})

Given('I am on the network edit page for {string}', network => {
  cy.visit('#/wallet')
  walletPage.clickNetworkDrawer()
  networkDrawer.changeNetwork(network)
  networkDrawer.clickManageNetworks()
  networkDrawer.clickEdit()
})

When('I change network to {string}', network => {
  networkDrawer.changeNetwork(network)
})

When('I navigate to edit network page', () => {
  networkDrawer.clickManageNetworks()
  networkDrawer.clickEdit()
})

Then('I am redirected to edit network page', () => {
  editNetworkPage.verifyEditNetworkFields()
})

Then('Current network is now {string}', network => {
  walletPage.validateServiceRunning(network)
})

Then('network details for {string} is displayed', network => {
  networkDrawer.validateNetworkPage(network)
})
