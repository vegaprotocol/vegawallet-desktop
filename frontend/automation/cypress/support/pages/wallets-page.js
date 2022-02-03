export default class WalletPage {
  passphraseInput = 'input-passphrase'
  passphraseSubmit = 'input-submit'
  walletList = '.wallet-list > li'
  generateKeyPairBtn = 'generate-keypair'

  validateUrl(url) {
    cy.url().should('contain', url)
  }

  clickOnWallet(walletName) {
    cy.getByTestId(walletName).click()
  }

  submitPassphrase(passphrase) {
    cy.get('body')
      .then(($body) => {
        if ($body.find(`[data-testid=${this.passphraseInput}]`).length) {
          cy.getByTestId(this.passphraseInput).type(passphrase)
          cy.getByTestId(this.passphraseSubmit).click()
        }
      })
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
    cy.get(this.walletList).should('have.length.of.at.least', 1)
  }

  clickOnTopWallet() {
    cy.get(this.walletList).last().find('button').click()
  }

  verifyErrorToastTxtIsDisplayed(expectedText) {
    cy.contains('Error').should('have.text', expectedText)
  }

  clickGenerateKeyPair() {
    cy.getByTestId(this.generateKeyPairBtn).click()
  }

  validateNumberOfKeyPairs(expectedNum) {
    cy.get('tr').should('have.length.at.least', expectedNum)
  }
}
