import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import WalletPage from '../pages/wallets-page'
const walletPage = new WalletPage()

Given('I am on the wallets page', () => {
  cy.visit('#/wallet')
})

Given('I have an existing Vega wallet', () => {
  console.log('create wallet')
})

Then('Wallets should be displayed on the page', () => {
  walletPage.validateWalletsDisplayed()
})
