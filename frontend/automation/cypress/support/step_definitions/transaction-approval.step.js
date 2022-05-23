import { And } from 'cypress-cucumber-preprocessor/steps'
import fetch from 'node-fetch'

And('A transaction is sent', () => {
  cy.getByTestId('transaction-dialog').should('not.exist')
  cy.wrap(simulateTx())
  cy.getByTestId('transaction-dialog').should('be.visible')
  cy.getByTestId('reject-transaction').click()
  // eslint-disable-next-line
  cy.wait(100)
})

const simulateTx = () => {
  return new Promise(async resolve => {
    // Get auth token to be able to submit tx
    const tokenRes = await fetch('http://127.0.0.1:1789/api/v1/auth/token', {
      method: 'POST',
      body: JSON.stringify({
        wallet: 'Test 23',
        passphrase: '123'
      })
    }).then(res => res.json())

    const txRes = await fetch('http://127.0.0.1:1789/api/v1/command/sync', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${tokenRes.token}`
      },
      body: JSON.stringify({
        pubKey:
          'f8885edfa7ffdb6ed996ca912e9258998e47bf3515c885cf3c63fb56b15de36f',
        propagate: true,
        orderSubmission: {
          marketId:
            '062ddcb97beae5b7cc4fa20621fe0c83b2a6f7e76cf5b129c6bd3dc14e8111ef',
          size: '1',
          type: 'TYPE_MARKET',
          side: 'SIDE_BUY',
          timeInForce: 'TIME_IN_FORCE_IOC'
        }
      })
    }).then(res => res.json())

    console.log('tx response:', txRes)

    // Dont wait for fetch to resolve before manually resolving
    // so we can check dialog is open
    resolve()
  })
}
