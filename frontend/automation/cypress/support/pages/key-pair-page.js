export default class KeypairPage {
  keyPairName = 'keypair-name'
  publicKey = 'public-key'

  validatePageDisplayed() {
    cy.getByTestId(this.keyPairName).should('contain', 'key')
    cy.getByTestId(this.publicKey)
      .invoke('text')
      .then(text => {
        expect(text.length).to.equal(64)
      })
  }
}
