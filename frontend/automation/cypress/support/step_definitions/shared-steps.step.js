import { Given, Then } from 'cypress-cucumber-preprocessor/steps'

import ImportWalletPage from '../pages/wallet-import-page'
const importWalletPage = new ImportWalletPage()

Given('I have an existing Vega wallet', () => {
  cy.visit('#/wallet')
  importWalletPage.createNewWallet()
})

Then('test wallet is cleaned', () => {
  cy.clean()
})
