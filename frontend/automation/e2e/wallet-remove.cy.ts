import { unlockWallet } from '../support/helpers'

describe('wallet remove', () => {
  const passphrase = Cypress.env('testWalletPassphrase')
  const walletName = Cypress.env('testWalletName')
  const form = 'remove-wallet-form'

  before(() => {
    cy.initApp()
    cy.restoreWallet()
  })

  it('removes a wallet', () => {
    // 0001-WALL-068 must be able to remove a wallet
    unlockWallet(walletName, passphrase)
    cy.getByTestId('remove-wallet').click()
    submitForm(form)
    cy.getByTestId('helper-text').contains('Required')
    cy.getByTestId(form).get('input[type="text"]').type('invalid text')
    submitForm(form)
    cy.getByTestId('helper-text').contains('Invalid confirmation text')
    cy.getByTestId(form)
      .get('input[type="text"]')
      .clear()
      .type(`Remove ${walletName}`)
    submitForm(form)
    cy.getByTestId('toast').should('contain.text', 'Wallet removed')
    cy.getByTestId('wallet-home').should('be.visible')
    cy.getByTestId(`wallet-${walletName}`).should('not.exist')
  })
})

function submitForm(form: string) {
  cy.getByTestId(form).should('be.visible').get('button[type="submit"]').click()
}
