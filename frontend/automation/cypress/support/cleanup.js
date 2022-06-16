after(() => {
  // Stop any running services
  cy.window().then(async win => {
    const handler = win.go.backend.Handler

    const service = await handler.GetServiceState()
    if (service.running) {
      await handler.StopService()
    }

    const console = await handler.GetConsoleState()
    if (console.running) {
      await handler.StopConsole()
    }

    const token = await handler.GetTokenDAppState()
    if (token.running) {
      await handler.StopTokenDApp()
    }
  })
})
