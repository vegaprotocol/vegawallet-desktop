after(() => {
  // Stop any running services
  cy.window().then(async win => {
    const handler = win.go.backend.Handler

    const service = await handler.GetCurrentServiceInfo()
    if (service.running) {
      await handler.StopService()
    }
  })
})
