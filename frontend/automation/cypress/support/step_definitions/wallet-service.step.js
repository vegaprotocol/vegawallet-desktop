import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import WalletPage from '../pages/wallets-page'
import NetworkDrawer from '../pages/network-drawer-page'
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
  // walletPage.validateServiceRunning("mainnet1")
})

Then('wallet service is returning {string}', (serviceStatus) => {
  const url = 'http://127.0.0.1:1789/api/v1/version'
  walletPage.CheckEndpoint(url, parseInt(serviceStatus))
})

Then('dApp running is shown', () => {
  walletPage.validateDAppRunning()
})

Then('dApp service is returning {string}', (serviceStatus) => {
  const url = 'http://127.0.0.1:1848'
  walletPage.CheckEndpoint(url, parseInt(serviceStatus))
})
