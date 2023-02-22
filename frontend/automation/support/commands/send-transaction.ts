export {}
type OrderTransaction = {
  orderSubmission: {
    marketId: string
    size: string
    type: string
    side: string
    timeInForce: string
  }
}

type VoteTransaction = {
  voteSubmission: {
    proposalId: string
    value: string
  }
}

type Transaction = OrderTransaction | VoteTransaction

declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      sendTransaction(transaction: Transaction): void
    }
  }
}

Cypress.Commands.add('sendTransaction', transaction => {
  const sendTransaction = async () => {
    const baseUrl = Cypress.env('walletServiceUrl')
    const pubKey = Cypress.env('testWalletPublicKey')
    const wallet = Cypress.env('testWalletName')
    const passphrase = Cypress.env('testWalletPassphrase')

    const tokenRes = await fetch(`${baseUrl}/auth/token`, {
      method: 'post',
      body: JSON.stringify({
        wallet,
        passphrase
      })
    })
    const tokenJSON = await tokenRes.json()

    // NOTE: Specifically not returning anything at the end of this promise so that cy.wrap
    // will complete and cypress will move on to the next task, this allows us to
    // inspect the dom and trigger actions (IE reject/approve transaction) while the promise
    // is left hanging

    fetch(`${baseUrl}/command/sync`, {
      method: 'post',
      headers: {
        authorization: `Bearer ${tokenJSON.token}`
      },
      body: JSON.stringify({
        pubKey,
        propagate: true,
        ...transaction
      })
    })
  }

  cy.wrap(sendTransaction())
})
