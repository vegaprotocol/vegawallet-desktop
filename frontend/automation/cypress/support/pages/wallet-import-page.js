export default class WalletImportPage {
  walletImportUrl = '#/wallet-import'
  createNewBtn = 'create-new-wallet'
  importWalletBtn = 'import-wallet'
  newWalletName = 'create-wallet-form-name'
  newWalletPassphrase = 'create-wallet-form-passphrase'
  confirmPassphrase = 'create-wallet-form-passphrase-confirm'
  createteWalletSubmit = 'create-wallet-form-submit'

  createNewWallet() {
    const randomNum = Math.floor(Math.random() * 101)
    const walletname = `Test ${randomNum.toString()}`

    cy.visit(this.walletImportUrl)
    this.clickCreateNew()
    this.fillInNewWalletDetails(walletname, '123')
    this.clickSubmit()
    this.verifyWalletCreated()
  }

  clickCreateNew() {
    cy.getByTestId(this.createNewBtn).click()
  }

  fillInNewWalletDetails(name, passphrase) {
    cy.getByTestId(this.newWalletName).type(name)
    cy.getByTestId(this.newWalletPassphrase).type(passphrase)
    cy.getByTestId(this.confirmPassphrase).type(passphrase)
  }

  clickSubmit() {
    cy.getByTestId(this.createteWalletSubmit).click()
  }

  verifyWalletCreated() {
    cy.contains('Wallet created!')
  }
}
