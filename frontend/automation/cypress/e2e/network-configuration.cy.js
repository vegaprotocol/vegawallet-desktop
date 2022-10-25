const { unlockWallet } = require('../support/helpers')
let walletName
let passphrase

before(() => {
  cy.clean()
  cy.backend().then(handler => {
    cy.setVegaHome(handler)
    cy.restoreNetwork(handler)
    cy.restoreNetwork(handler, 'test_network2')
    cy.restoreNetwork(handler, 'test_network3')
    cy.restoreWallet(handler)
  })
})

beforeEach(() => {
  passphrase = Cypress.env('testWalletPassphrase')
  walletName = Cypress.env('testWalletName')
  cy.waitForHome()
  unlockWallet(walletName, passphrase)
  cy.getByTestId('network-drawer').click()
})

describe('manage networks', () => {
  it('change network and persists after reload', () => {
    cy.getByTestId('network-select').click()
    cy.getByTestId('select-test_network2').click()
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: test_network2'
    )

    cy.reload()
    unlockWallet(walletName, passphrase)

    cy.getByTestId('service-status')
      .contains('Wallet Service: test_network2 on http://127.0.0.1:1789')
      .should('exist')

    cy.getByTestId('network-select').click()
    cy.getByTestId('select-test').click()
    cy.getByTestId('service-status').should(
      'contain.text',
      'Wallet Service: test'
    )
  })

  it('view network details', () => {
    cy.getByTestId('network-select').should('have.text', 'test')
    cy.getByTestId('service-url').should('not.be.empty')
    cy.getByTestId('nodes-list').each($node => {
      // eslint-disable-next-line no-unused-expressions
      expect($node.text()).not.to.be.empty
    })
    cy.getByTestId('network-log-level').should('have.text', 'info')
    cy.getByTestId('token-expiry').should('have.text', '168h0m0s')
  })

  it('edit network details displayed', () => {
    cy.edit_network_config_form_for_specified_network('test')
    cy.getByTestId('service-host').invoke('val').should('not.be.empty')
    cy.getByTestId('service-port').invoke('val').should('not.be.empty')
    cy.getByTestId('node-list').invoke('val').should('not.be.empty')
    cy.getByTestId('node-list').first().invoke('val').should('not.be.empty')
    cy.contains('gRPC Nodes')
      .next()
      .within(() => {
        cy.getByTestId('node-list').first().invoke('val').should('not.be.empty')
      })
    cy.contains('GraphQL Nodes')
      .next()
      .within(() => {
        cy.getByTestId('node-list').first().invoke('val').should('not.be.empty')
      })
    cy.getByTestId('network-log-level').invoke('val').should('not.be.empty')
    cy.getByTestId('node-retries').invoke('val').should('not.be.empty')
    cy.getByTestId('token-expiry').invoke('val').should('not.be.empty')
  })

  it('remove network', () => {
    // 0001-WALL-013
    cy.getByTestId('manage-networks').click()
    cy.getByTestId('remove-network-test_network2').click()
    cy.getByTestId('toast').contains('Successfully removed network')
  })
})

describe('change network details', () => {
  // 0001-WALL-011

  beforeEach(() => {
    cy.edit_network_config_form_for_specified_network('test_network3')
  })

  it('able to change service host', () => {
    const newServiceHost = '127.0.0.9'
    cy.getByTestId('service-host').clear().type(newServiceHost)
    cy.submit_network_config_form()
    cy.edit_network_config_form_for_specified_network('test_network3')
    cy.getByTestId('service-host').should('have.value', newServiceHost)
  })

  it('able to change service port', () => {
    const newServicePort = '9999'
    cy.getByTestId('service-port').clear().type(newServicePort)
    cy.submit_network_config_form()
    cy.edit_network_config_form_for_specified_network('test_network3')
    cy.getByTestId('service-port').should('have.value', newServicePort)
  })

  it('able to change gRPC nodes', function () {
    cy.contains('gRPC Nodes')
      .next()
      .within(() => {
        // take note of first node
        cy.getByTestId('node-list').first().its('val').as('first_grpc_node')

        // delete first node
        cy.getByTestId('node-list').first().siblings().click()
      })
      .then(() => {
        cy.submit_network_config_form()
        cy.edit_network_config_form_for_specified_network('test_network3')

        cy.contains('gRPC Nodes')
          .next()
          .within(() => {
            // check first node is no longer present
            cy.getByTestId('node-list')
              .first()
              .should('not.have.value', this.first_grpc_node)
          })
      })
  })

  it('able to add a new GraphQL Node, and delete existing', () => {
    const newGraphQlUrl = 'https://mochachoca.vega.xyz/query'
    cy.contains('GraphQL Nodes')
      .next()
      .within(() => {
        cy.contains('Add').click()

        cy.getByTestId('node-list').last().type(newGraphQlUrl)

        cy.getByTestId('node-list').first().siblings().click()
      })

    cy.submit_network_config_form()
    cy.edit_network_config_form_for_specified_network('test_network3')

    cy.contains('GraphQL Nodes')
      .next()
      .within(() => {
        cy.getByTestId('node-list').first().should('have.value', newGraphQlUrl)
      })
  })

  it('able to add a new REST Node', () => {
    const newRestUrl = 'https://rest.nodes.vega.xyz/query'
    cy.contains('REST Nodes')
      .next()
      .within(() => {
        cy.contains('Add').click()

        cy.getByTestId('node-list').first().type(newRestUrl)
      })

    cy.submit_network_config_form()
    cy.edit_network_config_form_for_specified_network('test_network3')

    cy.contains('REST Nodes')
      .next()
      .within(() => {
        cy.getByTestId('node-list').should('have.value', newRestUrl)
      })
  })

  // review if this is still needed as it doesn't seem to be working
  // https://github.com/vegaprotocol/vegawallet-desktop/issues/382
  it.skip('able to change log level', () => {
    const newLogLevel = 'debug'
    cy.getByTestId('network-log-level').select(newLogLevel)
    cy.submit_network_config_form()
    cy.edit_network_config_form_for_specified_network('test_network3')
    cy.getByTestId('network-log-level').should('have.value', newLogLevel)
  })

  it('able to change gRPC Node retries', () => {
    const newRetryAmount = '1'
    cy.getByTestId('node-retries').clear().type(newRetryAmount)
    cy.submit_network_config_form()
    cy.edit_network_config_form_for_specified_network('test_network3')
    cy.getByTestId('node-retries').should('have.value', newRetryAmount)
  })

  it('able to change token expiry duration', () => {
    const newDuration = '48h48m48s'
    cy.getByTestId('token-expiry').clear().type(newDuration)
    cy.submit_network_config_form()
    cy.edit_network_config_form_for_specified_network('test_network3')
    cy.getByTestId('token-expiry').should('have.value', newDuration)
  })

  Cypress.Commands.add('submit_network_config_form', () => {
    cy.getByTestId('submit').click()
    cy.getByTestId('toast').contains('Configuration saved').should('be.visible')
  })

  Cypress.Commands.add(
    'edit_network_config_form_for_specified_network',
    network => {
      cy.getByTestId('network-drawer').click()
      cy.getByTestId('network-drawer').click()
      cy.getByTestId('manage-networks').click()
      cy.getByTestId(`edit-network-${network}`).first().click()
      cy.getByTestId('service-host', { timeout: 30000 }).should('be.visible')
    }
  )
})
