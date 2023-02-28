import { hasOperationName } from '../graphql'
import { generateAccounts } from '../helpers'

export {}

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      mockRequests(): void
    }
  }
}

Cypress.Commands.add('mockRequests', () => {
  cy.log('mocking presets')
  cy.intercept(
    'GET',
    'https://raw.githubusercontent.com/vegaprotocol/networks/master/networks.json',
    {
      body: [
        {
          name: 'mainnet1',
          configFileUrl:
            'https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml',
          sha: '0dfd8d1539ae28a460d5ef2d28067156192b944c'
        }
      ]
    }
  ).as('presets')
  cy.intercept(
    'GET',
    'https://raw.githubusercontent.com/vegaprotocol/networks-internal/master/networks.json',
    {
      body: [
        {
          name: 'fairground',
          configFileUrl:
            'https://raw.githubusercontent.com/vegaprotocol/networks-internal/main/fairground/vegawallet-fairground.toml',
          sha: '5b05d0ca9d1155b43ca5e9199e2414dec3dda102'
        }
      ]
    }
  ).as('presets')
  const url = 'https://mock.vega.xyz/query'
  cy.log('mocking gql GET ' + url)
  cy.intercept('GET', url, req => {
    req.reply({
      statusCode: 200
    })
  }).as('nodeTest')
  cy.log('mocking gql POST ' + url)
  cy.intercept('POST', url, req => {
    if (hasOperationName(req, 'Accounts')) {
      req.alias = 'Accounts'
      req.reply({
        body: {
          data: {
            party: {
              __typename: 'Party',
              id: Cypress.env('testWalletPublicKey'),
              accounts: generateAccounts()
            }
          }
        }
      })
    }
  }).as('GQL')
})
