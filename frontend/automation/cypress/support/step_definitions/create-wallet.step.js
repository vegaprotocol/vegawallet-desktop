import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

Given('I navigate to the wallet page', page => {
  cy.visit('#/wallet-import')
})

Then('I can see the create new wallet button', () => {
  cy.get("[data-testid='create-new-wallet']").should('exist')
})

When('I click create new', () => {
  cy.get("[data-testid='create-new-wallet']").click()
})

Then('I see the create wallet form', () => {
  cy.get("[data-testid='create-wallet-form']").should('exist')
})

When('I submit the create wallet form', () => {
  cy.get("[data-testid='create-wallet-form-name']").type('test')
  cy.get("[data-testid='create-wallet-form-passphrase']").type('123')
  cy.get("[data-testid='create-wallet-form-passphrase-confirm']").type('123')
  cy.get("[data-testid='create-wallet-form-submit']").click()
})

Then('I see a warning message, the wallet version and recovery phrase', () => {
  cy.get("[data-testid='wallet-warning']").should('exist')
  cy.get("[data-testid='wallet-version']").should('exist')
  cy.get("[data-testid='wallet-recovery-phrase']").should('exist')
})

When('I click view wallet button', () => {
  cy.get("[data-testid='view-wallet-button']").click()
})

Then('I am redirected to the wallets page', () => {
  cy.url().should('include', '/wallet/detail')
})
