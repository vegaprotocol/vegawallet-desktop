import '../cleanup'

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

import KeypairPage from '../pages/key-pair-page'
import WalletImportPage from '../pages/wallet-import-page'
import WalletPage from '../pages/wallets-page'
const walletImportPage = new WalletImportPage()
const walletPage = new WalletPage()
const keyPairPage = new KeypairPage()

Given('I am on the add or recover wallet page', () => {
  cy.visit('#/wallet-import')
})

When('I click Import by recovery phrase', () => {
  walletImportPage.clickImport()
})

When('I click submit', () => {
  walletImportPage.clickSubmit()
})

When('fill in details for wallet recovery', () => {
  const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
  walletImportPage.importWallet('import test', recoveryPhrase, 2, '123')
})

When('fill in details for wallet recovery with different name', () => {
  const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
  walletImportPage.importWallet('import new test', recoveryPhrase, 2, '123')
})

When('fill in details for wallet recovery with version 1', () => {
  const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
  walletImportPage.importWallet('import old version', recoveryPhrase, 1, '123')
})

When('I fill in details with incorrect recovery phrase', () => {
  const recoveryPhrase =
    'brown eternal intact name raw memory squeeze two social road click small gadget vote kitchen best split hungry rail coin season visa category hold'
  walletImportPage.importWallet(
    'incorrect recovery phrase test',
    recoveryPhrase,
    2,
    '123'
  )
})

Then('wallet should be recovered', () => {
  walletImportPage.verifyWalletImportedSuccessfully()
})

Then('public key is as expected', () => {
  const publicKey =
    '355bc85ef9d8e3d1018ee81dc36a94ba0e15615457da2a496ea32a8badec2d41'

  walletPage.clickOnTopWallet()
  walletPage.submitPassphrase('123')
  walletPage.clickOnTopKeyPair()
  keyPairPage.validatePublicKey(publicKey)
})

Then('error shown for wallet already exists', () => {
  walletPage.verifyErrorToastTxtIsDisplayed(
    'Error: a wallet with the same name already exists'
  )
})

Then('empty fields are marked required', () => {
  walletImportPage.verifyNumberOfEmptyFields(4)
})

Then('error shown for incorrect recovery phrase', () => {
  walletPage.verifyErrorToastTxtIsDisplayed(
    "Error: couldn't import the wallet: recovery phrase is not valid"
  )
})
