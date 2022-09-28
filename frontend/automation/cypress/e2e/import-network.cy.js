const { unlockWallet } = require('../support/helpers')
const path = require('path')

describe('import network', () => {
  beforeEach(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler)
        cy.restoreWallet(handler)
      })
      .then(() => {
        const walletName = Cypress.env('testWalletName')
        const passphrase = Cypress.env('testWalletPassphrase')

        cy.waitForHome()
        unlockWallet(walletName, passphrase)
        cy.getByTestId('network-drawer').click()
        cy.getByTestId('manage-networks').click()
      })
  })

  it('import using dropdown', () => {
    cy.getByTestId('import-network-select').select('mainnet1')
    cy.getByTestId('import').click()
    cy.getByTestId('toast').contains('Network imported to:')
  })

  it('import successfully using url', () => {
    const url = Cypress.env('mainnetConfigUrl')

    cy.getByTestId('import-network-select').select('Other')
    cy.getByTestId('url-path').type(url)
    cy.getByTestId('import').click()
    cy.getByTestId('toast').contains('Network imported to:')
  })

  it('import failure using url', () => {
    const url =
      'https://githubusercontent.com/vegaprotocol/networks/master/mainnet1/fake.toml'

    cy.getByTestId('import-network-select').select('Other')
    cy.getByTestId('url-path').type(url)
    cy.getByTestId('import').click()
    cy.getByTestId('toast').contains(
      "Error: couldn't import network configuration"
    )
  })

  it('overwrite network that already exists', () => {
    cy.getByTestId('import-network-select').select('Other')
    cy.getByTestId('url-path').type(Cypress.env('testNetworkPath'))
    cy.getByTestId('import').click()
    cy.getByTestId('toast')
      .contains("Error: couldn't import network configuration")
    // overwrite message shown, check overwrite and re submit
    cy.getByTestId('toast').should('not.exist')
    cy.get('button[role="checkbox"]').click()
    cy.getByTestId('import').click()
    cy.getByTestId('toast').contains('Network imported to:')
  })

  it('import same network with different name', () => {
    const url = Cypress.env('testnetConfigUrl')

    cy.getByTestId('import-network-select').select('Other')
    cy.getByTestId('url-path').type(url)
    cy.getByTestId('network-name').type('custom')
    cy.getByTestId('import').click()
    cy.getByTestId('toast').contains('Network imported to:')
  })

  // Getting RSA keys already exist error on startup
  // for only this test
  it('import successfully via file path', () => {
    const url = Cypress.env('mainnetConfigUrl')

    cy.downloadFile(url, 'network-config', 'mainnet-config.toml')
    cy.getByTestId('import-network-select').select('Other')

    const filePath = path.join(
      Cypress.config('projectRoot'),
      'network-config/mainnet-config.toml'
    )

    cy.getByTestId('import-network-select').select('Other')
    cy.getByTestId('url-path').type(filePath)
    cy.getByTestId('import').click()
    cy.getByTestId('toast').contains('Network imported to:')
  })

  it('import failure via file path', () => {
    const invalidFilePath = './network-config/mainnet1'

    cy.getByTestId('import-network-select').select('Other')
    cy.getByTestId('url-path').type(invalidFilePath)
    cy.getByTestId('import').click()
    cy.getByTestId('toast').contains(
      "Error: couldn't import network configuration"
    )
  })
})
