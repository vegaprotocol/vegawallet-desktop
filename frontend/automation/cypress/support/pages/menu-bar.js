export default class menuBar {
  wallets = 'Wallets'
  addOrRecoverWallet = 'Add / Recover Wallet'
  walletService = 'Wallet Service'
  networkConfiguration = 'Network Configuration'
  addNetwork = 'Add Network'
  docs = 'Docs'
  github = 'Github'

  clickOnWallets() {
    cy.getByTestId(this.wallets).click()
  }

  clickOnaddOrRecoverWallet() {
    cy.getByTestId(this.addOrRecoverWallet).click()
  }

  clickOnwalletService() {
    cy.getByTestId(this.walletService).click()
  }

  clickOnnetworkConfiguration() {
    cy.getByTestId(this.networkConfiguration).click()
  }

  clickOnaddNetwork() {
    cy.getByTestId(this.addNetwork).click()
  }

  clickOndocs() {
    cy.getByTestId(this.docs).click()
  }

  clickOngithub() {
    cy.getByTestId(this.github).click()
  }
}
