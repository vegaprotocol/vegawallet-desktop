export default class WalletPage {
  passphraseInput = 'input-passphrase'

  clickOnWallet(walletName) {
    cy.getByTestId(walletName).click()
  }

  submitPassphrase(passphrase) {
    cy.getByTestId(this.passphraseInput).type(passphrase)
    cy.get('Submit').click()
  }

  validateKeyPairDisplayed(keyPairName) {
    cy.getByTestId(keyPairName).should('have.text', keyPairName)
  }

  validatePublicKey(keyPairName, publicKey) {
    cy.getByTestId(`${keyPairName}-public-key`).should('have.text', publicKey)
  }
}
