const { unlockWallet, authenticate } = require('../support/helpers')

describe('wallet annotate metadata', () => {
  let walletName
  let passphrase

  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
        cy.restoreNetwork(handler, 'mainnet1')
        cy.restoreWallet(handler)
      })
      .then(() => {
        cy.visit('/')
        cy.getByTestId('home-splash', { timeout: 30000 }).should('exist')
      })
  })

  beforeEach(() => {
    passphrase = Cypress.env('testWalletPassphrase')
    walletName = Cypress.env('testWalletName')
  })

  it('handles metadata updates', () => {
    unlockWallet(walletName, passphrase)
    goToMetadataPage()

    cy.getByTestId('metadata-key-0').contains('name')
    cy.getByTestId('metadata-value-0').should('exist')

    addPair('first', 'value-1')
    addPair('second', 'value-2')
    addPair('third', 'value-3')

    cy.get('[data-rbd-droppable-id="meta"]')
      .first()
      .then(([$droparea]) => {
        cy.get('[data-rbd-draggable-context-id="1"]')
          .last()
          .then(([$el, ...rest]) => {
            dragByY({
              element: $el,
              droparea: $droparea,
              offsetY: -85
            })

            // cy.getByTestId('metadata-key-1').contains('second')
            // cy.getByTestId('metadata-value-1').contains('value-2')
            // cy.getByTestId('metadata-key-2').contains('first')
            // cy.getByTestId('metadata-value-2').contains('value-1')
            // cy.getByTestId('metadata-key-3').contains('third')
            // cy.getByTestId('metadata-value-3').contains('value-3')

            // updateMetadata()
            // authenticate(passphrase)

            // cy.getByTestId('toast').contains('Successfully updated metadata')
          })
      })
  })
})

function goToMetadataPage() {
  cy.getByTestId('wallet-actions').click()
  cy.getByTestId('wallet-action-metadata').click()
  cy.get('html').click() // close dropdown
}

function addPair(key, value) {
  cy.getByTestId('metadata-add').click()
  cy.getByTestId('metadata-key').last().type(key)
  cy.getByTestId('metadata-value').last().type(value)
}

function dragByY({ element, droparea, offsetY }) {
  console.log(droparea)
  const dropCoords = droparea.getBoundingClientRect()
  const elementCoords = element.getBoundingClientRect()
  console.log(elementCoords.y + offsetY)

  cy.wrap(element)
    .trigger('mousedown', {
      clientX: elementCoords.x,
      clientY: elementCoords.y,
      force: true
    })
    .trigger('mousemove', {
      clientX: elementCoords.left + 10,
      clientY: elementCoords.y + offsetY,
      force: true
    })

  cy.get('body')
    .trigger('mousemove', {
      clientX: dropCoords.x,
      clientY: dropCoords.y + offsetY,
      force: true
    })
    .trigger('mouseup', {
      clientX: dropCoords.x,
      clientY: dropCoords.y + offsetY,
      force: true
    })
}

function updateMetadata() {
  cy.getByTestId('metadata-submit').click()
}
