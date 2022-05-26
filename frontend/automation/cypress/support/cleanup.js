before(() => {
  cy.clean()
})

after(() => {
  cy.clean()

  // Stop any running services
  cy.window().then(win => {
    const handler = win.go.backend.Handler

    handler
      .StopService()
      .then(() => handler.StopConsole())
      .then(() => handler.StopTokenDApp())
  })
})
