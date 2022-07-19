before(() => {
  cy.intercept(
    'GET',
    'https://raw.githubusercontent.com/vegaprotocol/networks/master/networks.json',
    {
      body: [
        {
          name: 'fairground',
          configFileUrl:
            'https://raw.githubusercontent.com/vegaprotocol/networks/master/fairground/fairground.toml',
          sha: '5a0f0091cf4943f55a01d11f02f10b70c42c3e57'
        },
        {
          name: 'mainnet1',
          configFileUrl:
            'https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml',
          sha: '0dfd8d1539ae28a460d5ef2d28067156192b944c'
        }
      ]
    }
  )
})
