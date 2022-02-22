import '../cleanup'

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

import NetworkDrawer from '../pages/network-drawer-page'
import WalletPage from '../pages/wallets-page'

const walletPage = new WalletPage()
const networkDrawer = new NetworkDrawer()

Given('I am on the Wallet Service page', () => {
  networkDrawer.expandNetworkDrawer()
})

When('I click start service for Token dApp', () => {
  networkDrawer.clickStartService()
})
Then('wallet service is shown as running', () => {
  networkDrawer.clickBack()
  walletPage.validateServiceRunning('mainnet1')
})

Then('wallet service is returning {string}', serviceStatus => {
  const url = Cypress.env('walletServiceUrl')
  walletPage.CheckEndpoint(url, parseInt(serviceStatus))
})

Then('dApp running is shown', () => {
  walletPage.validateDAppRunning()
})

Then('dApp service is returning {string}', serviceStatus => {
  const url = Cypress.env('tokenServiceUrl')
  walletPage.CheckEndpoint(url, parseInt(serviceStatus))
})
