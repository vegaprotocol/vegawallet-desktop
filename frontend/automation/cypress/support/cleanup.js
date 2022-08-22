after(() => {
  // Stop any running services
  cy.window().then(async win => {
    const handler = win.go.backend.Handler

    const service = await handler.GetServiceState()
    if (service.running) {
      await handler.StopService()
    }
  })
})
