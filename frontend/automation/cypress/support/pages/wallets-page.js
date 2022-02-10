export default class WalletPage {
  passphraseInput = 'input-passphrase'
  passphraseSubmit = 'input-submit'
  walletList = 'wallet-list'
  generateKeyPairBtn = 'generate-keypair'
  lockWalletBtn = 'lock'
  keyPair = 'tr > td > a'
  copyPublicKeyBtn = 'public-key'
  networkDrawer = 'network-drawer'
  serviceStatus = 'service-status'
  dAppStatus = 'dapp-status'

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

  copyTopPublicKey() {
    cy.getByTestId(this.copyPublicKeyBtn).first().click()
  }

  validateCopyKeyBtn(){
    cy.task('getClipboard')
    .then(($copiedText) => {
      console.log($copiedText)
      cy.getByTestId(this.copyPublicKeyBtn).eq(0)
      .invoke('text')
      .then(text => {
        const partText = text.slice(0,-6)
        expect($copiedText).to.contain(partText)
      })
    })
  }

  validateWalletsDisplayed() {
    cy.getByTestId(this.walletList).should('have.length.of.at.least', 1)
  }

  validateWalletUnlocked() {
    cy.getByTestId(this.generateKeyPairBtn).should('have.length.of.at.least', 1)
    cy.getByTestId(this.lockWalletBtn).should('have.length.of.at.least', 1)
  }

  validateServiceRunning(serviceName) {
    cy.getByTestId(this.serviceStatus).should('have.text', 'Connected to ')
    cy.getByTestId(this.serviceStatus).should('have.text', serviceName)
    cy.getByTestId(this.serviceStatus).should('have.text', 'http://')
  }

  validateDAppRunning() {
    cy.getByTestId(this.serviceStatus).should('have.text', 'dApp running:')
    cy.getByTestId(this.serviceStatus).should('have.text', 'http://')
  }

  validateDAppNotRunning() {
    cy.getByTestId(this.serviceStatus).should('have.text', 'dApp not running')
  }

  clickOnTopWallet() {
    cy.getByTestId(this.walletList).last().click({force:true})
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

  clickOnTopKeyPair() {
    cy.get(this.keyPair).eq(0).click({force:true})
  }

  clickNetworkDrawer(){
    cy.getByTestId(this.networkDrawer).click()
  }
}
