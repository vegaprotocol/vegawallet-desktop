export default class WalletImportPage {
  walletImportUrl = '#/wallet-import'
  createNewBtn = 'create-new-wallet'
  importWalletBtn = 'import-wallet'
  newWalletName = 'create-wallet-form-name'
  newWalletPassphrase = 'create-wallet-form-passphrase'
  confirmPassphrase = 'create-wallet-form-passphrase-confirm'
  walletSubmit = 'submit'
  importWalletName = 'wallet-name'
  importRecoveryPhrase = 'recovery-phrase'
  importVersion = 'version'
  importPassphrase = 'passphrase'
  importConfirmPassphrase = 'confirm-passphrase'
  validationRequired = 'Required'
  advancedOption = 'advanced-options'
  onboardImportNetwork = 'onboard-import-network-button'

  createNewWallet() {
    const randomNum = Math.floor(Math.random() * 101)
    const walletname = `Test ${randomNum.toString()}`

    this.clickCreateNew()
    this.fillInNewWalletDetails(walletname, '123')
    this.clickSubmit()
    this.verifyWalletCreated()
  }

  importWallet(walletName, passphrase, recoveryPhrase, version = 2) {
    cy.getByTestId(this.importWalletName).type(walletName)
    cy.getByTestId(this.importRecoveryPhrase).type(recoveryPhrase)
    cy.getByTestId(this.importVersion).select(`${version}`)
    cy.getByTestId(this.importPassphrase).type(passphrase)
    cy.getByTestId(this.importConfirmPassphrase).type(passphrase)
    this.clickSubmit()
  }

  clickCreateNew() {
    cy.getByTestId(this.createNewBtn).click()
  }

  clickImport() {
    cy.getByTestId(this.importWalletBtn).click()
  }

  fillInNewWalletDetails(name, passphrase) {
    cy.getByTestId(this.newWalletName).type(name)
    cy.getByTestId(this.newWalletPassphrase).type(passphrase)
    cy.getByTestId(this.confirmPassphrase).type(passphrase)
  }

  clickSubmit() {
    cy.getByTestId(this.walletSubmit).click()
  }

  clickImportNetwork() {
    cy.getByTestId(this.onboardImportNetwork).click()
  }

  verifyWalletCreated() {
    cy.contains('Wallet created!')
  }

  verifyWalletImportedSuccessfully() {
    cy.contains('Wallet imported to:')
  }

  verifyNumberOfEmptyFields(expecterNum) {
    cy.getByTestId(this.validationRequired).should('have.length', expecterNum)
  }
}
