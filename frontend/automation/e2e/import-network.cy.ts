import path from 'path'

describe('Import network', () => {
  before(() => {
    cy.initApp()
    cy.removeNetwork()
    cy.getByTestId('network-drawer').click()
    cy.getByTestId('manage-networks').click()
    cy.getByTestId('add-network').click()
  })

  beforeEach(() => {
    cy.getByTestId('url-path').clear()
  })

  it('import successfully using url', () => {
    const url = Cypress.env('testnetConfigUrl')

    cy.getByTestId('url-path').type(url)
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should('contain.text', 'Network imported')
  })

  it('import failure using url', () => {
    const url =
      'https://githubusercontent.com/vegaprotocol/networks/master/mainnet1/fake.toml'

    cy.getByTestId('url-path').type(url)
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should(
      'contain.text',
      'Error: could not fetch the network configuration'
    )
  })

  // Skipped until bug fixed
  // https://github.com/vegaprotocol/vegawallet-desktop/issues/561
  it.skip('import successfully via file path', () => {
    const filePath = `file://${path.join(
      Cypress.config('projectRoot'),
      'automation/data/networks/mainnet1.toml'
    )}`

    // 0001-WALL-010
    cy.getByTestId('url-path').type(filePath)
    cy.getByTestId('network-name').type('custom')
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should('contain.text', 'Network imported')
  })

  it('import failure via file path', () => {
    const invalidFilePath = 'this/is/invalid/path/file.toml'

    cy.getByTestId('url-path').type(invalidFilePath)
    cy.getByTestId('network-name').type('custom')
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should(
      'contain.text',
      'Error: a network source is required'
    )
  })
})

describe('existing networks', () => {
  before(() => {
    cy.initApp()
    cy.getByTestId('network-drawer').click()
    cy.getByTestId('manage-networks').click()
    cy.getByTestId('add-network').click()
  })

  beforeEach(() => {
    cy.getByTestId('url-path').clear()
  })

  it('overwrite network that already exists', () => {
    cy.getByTestId('url-path').type(Cypress.env('mainnetConfigUrl'))
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should(
      'contain.text',
      'Error: a network with the same name already exists'
    )
    // overwrite message shown, check overwrite and re submit
    cy.getByTestId('toast').should('not.exist')
    cy.get('button[role="checkbox"]').click()
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should('contain.text', 'Network imported')
  })

  it('import same network with different name', () => {
    const url = Cypress.env('mainnetConfigUrl')

    cy.getByTestId('url-path').type(url)
    cy.getByTestId('network-name').type(`custom-${Date.now()}`)
    cy.getByTestId('import-network').click()
    cy.getByTestId('toast').should('contain.text', 'Network imported')
  })
})
