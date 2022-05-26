before(() => {
  cy.clean()
})

after(() => {
  cy.clean()

  // Stop any running services
  cy.window().then(win => {
    const handler = win.go.backend.Handler

    return handler
      .GetServiceState()
      .then(res => {
        if (res.running) {
          return handler.StopService()
        }
        return Promise.resolve()
      })
      .then(() => handler.GetConsoleState())
      .then(res => {
        if (res.running) {
          return handler.StopConsole()
        }
        return Promise.resolve()
      })
      .then(() => handler.GetTokenDAppState())
      .then(res => {
        if (res.running) {
          return handler.StopTokenDApp()
        }
        return Promise.resolve()
      })
  })
})
