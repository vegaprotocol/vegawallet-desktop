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

  validatePublicKey(keyPairName) {
    cy.getByTestId(`${keyPairName}-public-key`).should('exist')
  }

  validateCopyKeyBtn(keyPairName, publicKey) {
    cy.getByTestId(`${keyPairName}-public-key`).click()
    cy.task('getClipboard').should('eq', publicKey)
  }

  validateWalletsDisplayed() {
    cy.get('.wallet-list > li').should('have.length.of.at.least', 1)
  }
}
