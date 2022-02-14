export default class EditNetworkPage {
  serviceHostField = 'service-host'
  servicePortField = 'service-port'
  consoleUrl = 'console-url'
  consolePort = 'console-port'
  tokenUrl = 'token-url'
  tokenPort = 'token-port'
  nodes = 'node-list'
  removeNode = 'remove'
  addNode = 'add'
  logLevel = 'log-level'
  grpcNodeRetries = 'node-retries'
  tokenExpiry = 'token-expiry'
  submitBtn = 'submit'

  verifyEditNetworkFields() {
    cy.getByTestId(this.serviceHostField).invoke('val')
    .should('not.be.empty')
    cy.getByTestId(this.servicePortField).invoke('val')
    .should('not.be.empty')
    cy.getByTestId(this.consoleUrl).invoke('val')
    .should('not.be.empty')
    // cy.getByTestId(this.consolePort).invoke('val')
    // .should('not.be.empty')
    cy.getByTestId(this.tokenUrl).invoke('val')
    .should('not.be.empty')
    cy.getByTestId(this.nodes).invoke('val')
    .should('not.be.empty')
    cy.getByTestId(this.logLevel).invoke('val')
    .should('not.be.empty')
    cy.getByTestId(this.grpcNodeRetries).invoke('val')
    .should('not.be.empty')
    cy.getByTestId(this.tokenExpiry).invoke('val')
    .should('not.be.empty')
  }
}
