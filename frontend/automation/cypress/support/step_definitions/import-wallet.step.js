import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import WalletImportPage from '../pages/wallet-import-page'
const walletImportPage = new WalletImportPage()

Given('I am on the add or recover wallet page', () => {
  cy.visit('#/wallet-import')
})

When('I click Import by recovery phrase', () => {
  walletImportPage.clickImport()
})

Then('fill in details for wallet recovery', () => {
  const recoveryPhrase =
    'brown eternal intact name raw memory squeeze three social road click little gadget vote kitchen best split hungry rail coin season visa category hold'
  walletImportPage.importWallet('import test', recoveryPhrase, 2, "123",)
})

Then('wallet should be recovered', () => {
  walletImportPage.verifyWalletImportedSuccessfully()
})
