export default class NetworkDrawer {
  importBtn = 'import'
  urlPathField = 'url-path'
  networkNameField = 'network-name'
  networkDropDown = 'network-select'
  manageNetworkBtn = 'manage-networks'
  restServices = 'services'
  restServiceUrl = 'service-url'
  consoleUrl = 'service-console'
  tokenUrl = 'service-token'
  nodeTable = 'node-table'
  nodeList = 'nodes-list'
  logLevel = 'log-level'
  tokenExpiry = 'token-expiry'

  ImportNetwork(urlPath, networkName = null) {
    if (this.IsNetworkEmpty() == false) {
      this.clickManageNetworks()
    } else this.clickImportBtn()

    cy.getByTestId(this.urlPathField).type(urlPath)
    if (networkName != null) {
      cy.getByTestId(this.networkNameField).type(networkName)
    }
    this.clickImportBtn()
  }

  clickImportBtn() {
    cy.getByTestId(this.importBtn).click()
  }

  clickManageNetworks() {
    cy.getByTestId(this.manageNetworkBtn).click()
  }

  verifyNetworkImportedSuccessfully() {
    cy.contains('Network imported to:')
  }

  verifyNetworkImportError() {
    cy.contains("Error: couldn't fetch network configuration")
    cy.contains("couldn't load file:")
    cy.contains('no such host')
  }

  IsNetworkEmpty() {
    cy.get('body').then($body => {
      if ($body.find(`[data-testid=${this.manageNetworkBtn}]`).length) {
        return false
      } else return true
    })
  }

  changeNetwork(networkName) {
    cy.getByTestId(this.networkDropDown).click()
    cy.getByTestId(`select-${networkName}`).click()
  }

  verifyNetworkSelectable(networkName) {
    cy.getByTestId(this.networkDropDown).click()

    cy.get('body').then($body => {
      if ($body.find(`[data-testid=select-${networkName}]`).length) {
        return true
      } else return false
    })
  }
}
