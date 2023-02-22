import path from 'path'

import { unlockWallet } from '../support/helpers'

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

  it('import from preset', () => {
    cy.getByTestId(`import-network-mainnet1`).click()
    cy.getByTestId('toast').should('contain.text', 'Network imported to:')
  })

  it('import successfully using url', () => {
    const url = Cypress.env('testnetConfigUrl')

    cy.getByTestId('add-network').click()
    cy.getByTestId('url-path').type(url)
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should('contain.text', 'Network imported to:')
  })

  it('import failure using url', () => {
    const url =
      'https://githubusercontent.com/vegaprotocol/networks/master/mainnet1/fake.toml'

    cy.getByTestId('add-network').click()
    cy.getByTestId('url-path').type(url)
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should(
      'contain.text',
      'Error: could not fetch the network configuration'
    )
  })

  it('overwrite network that already exists', () => {
    cy.getByTestId('add-network').click()
    cy.getByTestId('url-path').type(Cypress.env('testNetworkPath'))
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should(
      'contain.text',
      'Error: a network with the same name already exists'
    )
    // overwrite message shown, check overwrite and re submit
    cy.getByTestId('toast').should('not.exist')
    cy.get('button[role="checkbox"]').click()
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should('contain.text', 'Network imported to:')
  })

  it('import same network with different name', () => {
    const url = Cypress.env('testnetConfigUrl')

    cy.getByTestId('add-network').click()
    cy.getByTestId('url-path').type(url)
    cy.getByTestId('network-name').type('custom')
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should('contain.text', 'Network imported to:')
  })

  // Getting RSA keys already exist error on startup
  // for only this test
  it('import successfully via file path', () => {
    const filePath = path.join(
      Cypress.config('projectRoot'),
      'automation/data/networks/mainnet1.toml'
    )

    // 0001-WALL-010
    cy.getByTestId('add-network').click()
    cy.getByTestId('url-path').type(filePath)
    cy.getByTestId('network-name').type('custom')
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should('contain.text', 'Network imported to:')
  })

  it('import failure via file path', () => {
    const invalidFilePath = 'this/is/invalid/path/file.toml'

    cy.getByTestId('add-network').click()
    cy.getByTestId('url-path').type(invalidFilePath)
    cy.getByTestId('network-name').type('custom')
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should(
      'contain.text',
      'Error: the network source file does not exist: invalid network source'
    )
  })
})
