describe('app config', () => {
  it('persists selected network', () => {
    cy.restoreWallet().then(() => {
      cy.getByTestId('wallet-list').should('have.length', 1)
    })
    assertNetwork('fairground')
    changeNetwork('mainnet1')
    cy.reload()
    assertNetwork('mainnet1')
    changeNetwork('fairground')
    cy.reload()
    assertNetwork('fairground')

    function changeNetwork(network) {
      cy.getByTestId('network-drawer').click()
      cy.getByTestId('network-select').click()
      cy.getByTestId(`select-${network}`).click()
    }

    function assertNetwork(network) {
      cy.getByTestId('service-status')
        .contains(`Wallet Service: ${network} on http://127.0.0.1:1789`)
        .should('exist')
    }
  })
})
