module.exports = {
  client: {
    service: {
      name: 'vega',
      url: 'https://lb.testnet.vega.xyz/query'
    },
    includes: ['../../{apps,libs}/**/*.{ts,tsx,js,jsx,graphql}'],
    excludes: ['**/generic-data-provider.ts']
  }
}
