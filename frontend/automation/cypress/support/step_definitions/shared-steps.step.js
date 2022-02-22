import { Given } from 'cypress-cucumber-preprocessor/steps'

import ImportWalletPage from '../pages/wallet-import-page'
const importWalletPage = new ImportWalletPage()

Given('I have an existing Vega wallet', () => {
  importWalletPage.createNewWallet()
})
