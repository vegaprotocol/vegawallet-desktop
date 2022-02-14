import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import WalletPage from '../pages/wallets-page'
import NetworkDrawer from '../pages/network-drawer-page'
import EditNetworkPage from '../pages/edit-network-page'
const walletPage = new WalletPage()
const networkDrawer = new NetworkDrawer()
const editNetworkPage = new EditNetworkPage()

Given('I am on the network edit page for {string}', (network) => {
  cy.visit('#/wallet')
  walletPage.clickNetworkDrawer()
  networkDrawer.changeNetwork(network)
  networkDrawer.clickManageNetworks()
  networkDrawer.clickEdit()
})

Then('I am redirected to edit network page', () => {
  editNetworkPage.verifyEditNetworkFields()
})
