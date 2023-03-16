// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type Handler = typeof import('../../src/wailsjs/go/backend/Handler')
type Win = Window &
  typeof globalThis & { go: { backend: { Handler: Handler } } }

after(() => {
  // Stop any running services
  cy.window().then(async win => {
    const handler = (win as Win).go.backend.Handler

    const service = await handler.GetCurrentServiceInfo()
    if (service.isRunning) {
      await handler.StopService()
    }
  })
})
