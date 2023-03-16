export {}
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      sendPermissionsRequest(
        hostname: string,
        requestedPermissions: { public_keys: string }
      ): void
    }
  }
}

Cypress.Commands.add(
  'sendPermissionsRequest',
  (hostname, requestedPermissions) => {
    const requestPermission = async () => {
      const baseUrl = Cypress.env('walletServiceUrl')
      const token = Cypress.env('clientSessionToken')

      await fetch(`${baseUrl}/requests`, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'client.request_permissions',
          params: {
            hostname,
            token,
            requestedPermissions
          },
          id: '0'
        })
      })
    }

    requestPermission()
  }
)
