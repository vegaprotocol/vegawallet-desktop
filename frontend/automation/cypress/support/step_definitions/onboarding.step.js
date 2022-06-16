import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

import NetworkDrawer from '../pages/network-drawer-page'
import WalletImportPage from '../pages/wallet-import-page'

const walletImportPage = new WalletImportPage()
const networkDrawer = new NetworkDrawer()

Given('I am on the onboarding page', page => {
  cy.visit('#/onboard')

  Given('I click create new wallet', () => {
    walletImportPage.clickCreateNew()
  })

  Given('I click use recovery phrase', () => {
    walletImportPage.clickImport()
  })

  Given('I click back', () => {
    networkDrawer.clickBack()
  })

  When('I submit wallet details', () => {
    walletImportPage.createNewWallet()
  })

  When('I submit a existing recovery phrase', () => {
    const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
    walletImportPage.importWallet('import test', '123', recoveryPhrase)
  })

  Then('wallet is successfully created', () => {
    walletImportPage.verifyWalletCreated()
  })

  Then('I click import network', () => {
    walletImportPage.clickImportNetwork()
  })

  Then('wallet is successfully imported', () => {
    walletImportPage.verifyWalletImportedSuccessfully()
  })

  Then('import {string} network', networkName => {
    networkDrawer.selectNetwork(networkName)
    networkDrawer.clickImportBtn()
  })

  Then('network is imported successfully', () => {
    networkDrawer.verifyNetworkImportedSuccessfully()
  })
})
