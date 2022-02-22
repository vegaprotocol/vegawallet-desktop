import './commands'
import '@cypress/code-coverage/support'

after(() => {
  cy.exec('npm run clean')
})
