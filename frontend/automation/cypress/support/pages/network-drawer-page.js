export default class NetworkDrawer {
  networkDrawerBtn = 'network-drawer'
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
  startServiceBtn = 'start'
  editNetworkBtn = 'edit'
  backBtn = 'back'

  ImportNetwork(urlPath, networkName = null, overwrite = false) {
    if (this.IsNetworkEmpty() == false) {
      this.clickManageNetworks()
    } else this.clickImportBtn()

    cy.getByTestId(this.urlPathField).type(urlPath)
    if (networkName != null) {
      cy.getByTestId(this.networkNameField).type(networkName)
    }
    this.clickImportBtn()

    if (overwrite == true) {
      this.OverwriteNetwork(networkName)
    }
  }

  OverwriteNetwork(newNetworkName = null) {
    cy.contains(
      'Network with name already exists. Provide a new name or overwrite by checking the box below'
    )
    if (newNetworkName != null) {
      cy.getByTestId(this.networkNameField).type(newNetworkName)
    }
    cy.get('[type="checkbox"]').click()
    this.clickImportBtn()
  }

  clickImportBtn() {
    cy.getByTestId(this.importBtn).click()
  }

  clickManageNetworks() {
    cy.getByTestId(this.manageNetworkBtn).click()
  }

  clickEdit() {
    cy.getByTestId(this.editNetworkBtn).click()
  }

  clickBack() {
    cy.getByTestId(this.backBtn).click({ force: true })
  }

  clickStartService() {
    cy.getByTestId(this.startServiceBtn).click({ force: true })
  }

  verifyNetworkImportedSuccessfully() {
    cy.contains('Network imported to:')
  }

  verifyNetworkImporturlError() {
    cy.contains("Error: couldn't fetch network configuration")
    cy.contains("couldn't load file:")
    cy.contains('no such host')
  }

  verifyNetworkImportFilePathError() {
    cy.contains("Error: couldn't read network configuration")
    cy.contains("couldn't read file:")
    cy.contains('no such file or directory')
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

  verifyNetworkPage() {
    cy.getByTestId(this.restServiceUrl).should('not.be.empty')
    cy.getByTestId(this.consoleUrl).should('not.be.empty')
    cy.getByTestId(this.tokenUrl).should('not.be.empty')
    cy.getByTestId(this.nodeList).each($node => {
      expect($node).not.to.be.empty
    })
    cy.getByTestId(this.logLevel).should('have.text', 'info')
    cy.getByTestId(this.tokenExpiry).should('have.text', '168h0m0s')
  }

  expandNetworkDrawer() {
    cy.get('body').then($body => {
      if ($body.find(`[data-testid=${this.manageNetworkBtn}]`).length) {
      } else cy.getByTestId(this.networkDrawerBtn).click({ force: true })
    })
  }
}
