export default class KeypairPage {
  keyPairName = 'keypair-name'
  publicKey = 'public-key'
  signMessageField = 'message-field'
  signBtn = 'sign'
  signMoreBtn = 'sign-more'

  validatePageDisplayed() {
    cy.getByTestId(this.keyPairName).should('contain', 'key')
    cy.getByTestId(this.publicKey)
      .invoke('text')
      .then(text => {
        expect(text.length).to.equal(64)
      })
  }

  validatePublicKey(expectedKey) {
    cy.getByTestId(this.publicKey)
      .invoke('text')
      .then(text => {
        expect(text).to.eq(expectedKey)
      })
  }

  signmessage(messageTxt) {
    cy.getByTestId(this.signMessageField).type(messageTxt)
    cy.getByTestId(this.signBtn).click()
  }

  validateMessageSignedSuccessfully() {
    cy.contains("Message signed successfully")
  }

  clickSignMore() {
    cy.getByTestId(this.signMoreBtn).click()
  }
}
