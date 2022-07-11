export function unlockWallet(name, passphrase) {
  cy.log(name)
  cy.getByTestId(name).click()
  cy.getByTestId('input-passphrase').type(passphrase)
  cy.getByTestId('input-submit').click()
}
