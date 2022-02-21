import '../cleanup'

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import WalletImportPage from '../pages/wallet-import-page'
const walletImportPage = new WalletImportPage()

Given('I click create new wallet', () => {
  walletImportPage.clickCreateNew()
})

Given('I click use recovery phrase', () => {
  walletImportPage.clickImport()
})

When('I submit wallet details', () => {
  walletImportPage.createNewWallet
})

When('I submit a existing recovery phrase', () => {
  const recoveryPhrase = Cypress.env('testWalletRecoveryPhrase')
  walletImportPage.importWallet('import test', recoveryPhrase, 2, '123')
})

Then('wallet is successfully created', () => {
  walletImportPage.verifyWalletCreated()
})

Then('wallet is successfully imported', () => {
  walletImportPage.verifyWalletImportedSuccessfully()
})


// Given('I navigate to the wallet page', page => {
//   cy.visit('#/')
// })

// Then('I can see the create new wallet button', () => {
//   cy.get("[data-testid='onboard-create-wallet']").should('exist')
// })

// When('I click create new', () => {
//   cy.get("[data-testid='onboard-create-wallet']").click()
// })

// Then('I see the create wallet form', () => {
//   cy.get("[data-testid='create-wallet-form']").should('exist')
// })

// When('I submit the create wallet form', () => {
//   cy.get("[data-testid='create-wallet-form-name']").type('test')
//   cy.get("[data-testid='create-wallet-form-passphrase']").type('123')
//   cy.get("[data-testid='create-wallet-form-passphrase-confirm']").type('123')
//   cy.get("[data-testid='create-wallet-form-submit']").click()
// })

// Then('I see a warning message, the wallet version and recovery phrase', () => {
//   cy.get("[data-testid='wallet-warning']").should('exist')
//   cy.get("[data-testid='wallet-version']").should('exist')
//   cy.get("[data-testid='wallet-recovery-phrase']").should('exist')
// })

// When('I click view import network button', () => {
//   cy.get("[data-testid='onboard-import-network-button']").click()
// })

// Then('I am taken to the next step of onboarding', () => {
//   cy.url().should('include', '/onboard/network')
})
