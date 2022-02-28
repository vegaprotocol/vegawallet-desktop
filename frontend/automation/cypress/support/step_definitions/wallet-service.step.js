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

When('I click start service with console', () => {
  networkDrawer.clickStartService()
})

Then('wallet service is shown as running', () => {
  walletPage.validateServiceRunning('fairground')
})

Then('wallet service is returning {string}', serviceStatus => {
  const url = Cypress.env('walletServiceUrl')
  walletPage.CheckEndpoint(url, parseInt(serviceStatus))
})

Then('dApp {string} is shown running', serviceName => {
  walletPage.validateDAppRunning(serviceName)
})

Then('dApp service is returning {string}', serviceStatus => {
  const url = Cypress.env('tokenServiceUrl')
  walletPage.CheckEndpoint(url, parseInt(serviceStatus))
})

Then('console service is returning {string}', serviceStatus => {
  const url = Cypress.env('consoleServiceUrl')
  walletPage.CheckEndpoint(url, parseInt(serviceStatus))
})
