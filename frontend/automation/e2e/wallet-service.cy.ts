describe('wallet service', () => {
  before(() => {
    cy.initApp()
  })

  it('imports and starts mainnet automatically', () => {
    cy.getByTestId('service-status')
      .scrollIntoView()
      .contains('Wallet Service: mainnet1', {
        timeout: 20000
      })
  })
})
