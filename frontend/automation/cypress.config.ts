import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 't5pfg7',
  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--disable-dev-shm-usage')
        }
        return launchOptions
      })
      config.env.testNetworkPath = require('path').join(
        config.projectRoot,
        'automation/data/networks/test.toml'
      )
      return config
    },
    baseUrl: 'http://localhost:34115/',
    fileServerFolder: '.',
    specPattern: './automation/e2e/**/*.cy.{ts,tsx}',
    fixturesFolder: false,
    defaultCommandTimeout: 20000,
    supportFile: './automation/support/e2e.ts',
    video: false,
    videoUploadOnPasses: false
  },
  env: {
    mainnetConfigUrl:
      'https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml',
    testnetConfigUrl:
      'https://raw.githubusercontent.com/vegaprotocol/networks-internal/main/fairground/vegawallet-fairground.toml',
    testWalletName: 'test',
    testWalletPassphrase: '123',
    testWalletPublicKey:
      '355bc85ef9d8e3d1018ee81dc36a94ba0e15615457da2a496ea32a8badec2d41',
    testWalletRecoveryPhrase:
      'brown eternal intact name raw memory squeeze three social road click little gadget vote kitchen best split hungry rail coin season visa category hold',
    vegaHome: './frontend/automation/test-wallets',
    walletServiceUrl: 'http://127.0.0.1:1789/api/v2'
  }
})
