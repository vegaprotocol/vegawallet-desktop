import './commands'
import '@cypress/code-coverage/support'

before(() => {
  cy.exec('npm run clean')
})

after(() => {
  cy.exec('npm run clean')
})
