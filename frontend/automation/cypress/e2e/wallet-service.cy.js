describe('wallet service', () => {
  before(() => {
    cy.clean()
    cy.backend()
      .then(handler => {
        cy.setVegaHome(handler)
      })
      .then(() => {
        cy.waitForHome()
      })
  })

  it('imports and starts mainnet automatically', () => {
    cy.getByTestId('service-status')
      .scrollIntoView()
      .contains('Wallet Service: mainnet1', {
        timeout: 20000
      })
  })
})
