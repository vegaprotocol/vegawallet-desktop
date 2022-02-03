import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'
import WalletPage from '../pages/wallets-page'
const walletPage = new WalletPage()

Given('I am on the wallets page', () => {
  cy.visit('#/wallet')
})

Given('I click on existing wallet', () => {
  walletPage.clickOnTopWallet()
})

Given('I am on wallet details page', () => {
  cy.visit('#/wallet')
  walletPage.clickOnTopWallet()
  walletPage.submitPassphrase('123')
  walletPage.validateUrl('wallet/detail')
})

When('I enter wrong passphrase', () => {
  walletPage.submitPassphrase('234')
})

When('I enter correct passphrase', () => {
  walletPage.submitPassphrase('123')
})

When('I click generate Keypair', () => {
  walletPage.clickGenerateKeyPair()
})

When('enter passphrase', () => {
  walletPage.submitPassphrase('123')
})

Then('Wallets should be displayed on the page', () => {
  walletPage.validateWalletsDisplayed()
})

Then('wrong passphrase is displayed', () => {
  walletPage.verifyErrorToastTxtIsDisplayed("Error: wrong passphrase");
})

Then('I am redirected to wallet details page', () => {
  walletPage.validateUrl('wallet/detail')
})

Then('new keypair is generated', () => {
  walletPage.validateNumberOfKeyPairs(2)
})
