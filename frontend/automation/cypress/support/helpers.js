export function unlockWallet(name, passphrase) {
  cy.log(name)
  cy.getByTestId(name).click()
  cy.getByTestId('input-passphrase').type(passphrase)
  // wait for form to be unmounted so that other elements can be interacted with as
  // the dialog adds pointer-events: none to the body element
  cy.getByTestId('input-submit').click()
  cy.getByTestId('passphrase-form').should('not.exist')
}
