before(() => {
  cy.initApp()
  cy.restoreNetwork()
  cy.restoreNetwork('test_network2')
  cy.restoreNetwork('test_network3')
  cy.reload()
  cy.waitForNetworkConnected()
})

beforeEach(() => {
  cy.visit('/')
  cy.getByTestId('network-drawer').click()
})

describe('manage networks', () => {
  it('change network and persists after reload', () => {
    cy.getByTestId('network-select').click()
    cy.getByTestId('select-test_network2').click()
    cy.getByTestId('service-status')
      .scrollIntoView()
      .contains('Wallet Service: test_network2', {
        timeout: 20000
      })

    cy.reload()

    cy.getByTestId('service-status')
      .scrollIntoView()
      .contains('Wallet Service: test_network2 on http://127.0.0.1:1789', {
        timeout: 20000
      })
      .should('be.visible')

    cy.getByTestId('network-drawer').click()
    cy.getByTestId('network-select').click()
    cy.getByTestId('select-test').click()
    cy.getByTestId('service-status')
      .scrollIntoView()
      .contains('Wallet Service: test', {
        timeout: 20000
      })
      .should('be.visible')
  })

  it('view network details', () => {
    cy.getByTestId('network-select').should('not.be.empty')
    cy.getByTestId('service-url').should('not.be.empty')
    cy.getByTestId('nodes-list').each($node => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect($node.text()).not.to.be.empty
    })
  })

  it('edit network details displayed', () => {
    edit_network_config_form_for_specified_network('test')
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
    cy.getByTestId('node-retries').invoke('val').should('not.be.empty')
  })

  it('remove network', () => {
    // 0001-WALL-013
    cy.getByTestId('manage-networks').click()
    cy.getByTestId('remove-network-test_network2').click()
    cy.getByTestId('toast').should(
      'contain.text',
      'Successfully removed network'
    )
  })
})

// Skipped until `https://github.com/vegaprotocol/vegawallet-desktop/issues/529` is fixed
describe.skip('change network details', () => {
  // 0001-WALL-011

  beforeEach(() => {
    edit_network_config_form_for_specified_network('test_network3')
  })

  it('able to change service console url', () => {
    const newURL = 'http://console.url'
    cy.getByTestId('network-console-url').clear().type(newURL)
    submit_network_config_form()
    edit_network_config_form_for_specified_network('test_network3')
    cy.getByTestId('network-console-url').should('have.value', newURL)
  })

  it('able to change service explorer url', () => {
    const newURL = 'http://explorer.url'
    cy.getByTestId('network-explorer-url').clear().type(newURL)
    submit_network_config_form()
    edit_network_config_form_for_specified_network('test_network3')
    cy.getByTestId('network-explorer-url').should('have.value', newURL)
  })

  it('able to change service token url', () => {
    const newURL = 'http://token.url'
    cy.getByTestId('network-token-url').clear().type(newURL)
    submit_network_config_form()
    edit_network_config_form_for_specified_network('test_network3')
    cy.getByTestId('network-token-url').should('have.value', newURL)
  })

  it('able to change gRPC nodes', function () {
    cy.getByTestId('node-list').should('have.length', 8) // wait until list has loaded
    cy.contains('gRPC Nodes')
      .next()
      .within(() => {
        cy.getByTestId('node-list').should('have.length', 7)
        // take note of first node
        cy.getByTestId('node-list').first().its('val').as('first_grpc_node')

        // delete first node
        cy.getByTestId('node-list').first().siblings().click()
      })
      .then(() => {
        submit_network_config_form()
        edit_network_config_form_for_specified_network('test_network3')

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

    submit_network_config_form()
    edit_network_config_form_for_specified_network('test_network3')

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

    submit_network_config_form()
    edit_network_config_form_for_specified_network('test_network3')

    cy.contains('REST Nodes')
      .next()
      .within(() => {
        cy.getByTestId('node-list').should('have.value', newRestUrl)
      })
  })

  it('able to change gRPC Node retries', () => {
    const newRetryAmount = '1'
    cy.getByTestId('node-retries').clear().type(newRetryAmount)
    submit_network_config_form()
    edit_network_config_form_for_specified_network('test_network3')
    cy.getByTestId('node-retries').should('have.value', newRetryAmount)
  })
})

const submit_network_config_form = () => {
  cy.getByTestId('submit').click()
  cy.getByTestId('toast')
    .should('contain.text', 'Configuration saved')
    .should('be.visible')
}

const edit_network_config_form_for_specified_network = (network: string) => {
  cy.getByTestId('network-drawer').click()
  cy.getByTestId('network-drawer').click()
  cy.getByTestId('manage-networks').click()
  cy.getByTestId(`edit-network-${network}`).first().click()
}
