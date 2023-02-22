export {}
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      sendConnectionRequest(hostname: String): void
    }
  }
}

Cypress.Commands.add('sendConnectionRequest', hostname => {
  const connectWallet = async () => {
    const baseUrl = Cypress.env('walletServiceUrl')

    const res = await fetch(`${baseUrl}/requests`, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'client.connect_wallet',
        params: {
          hostname
        },
        id: '0'
      })
    })

    const { result } = await res.json()
    Cypress.env('clientSessionToken', result.token)
  }

  connectWallet()
})
