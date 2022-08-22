before(() => {
  cy.exec('npm run createcustomconfig')
})

beforeEach(() => {
  cy.mockRequests()
})
