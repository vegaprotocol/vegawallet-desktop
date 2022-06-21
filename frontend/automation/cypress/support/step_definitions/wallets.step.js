import '../cleanup'

import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps'

import KeypairPage from '../pages/key-pair-page'
import WalletPage from '../pages/wallets-page'
const walletPage = new WalletPage()
const keyPairPage = new KeypairPage()

Given('I am on the wallets page', () => {
  cy.visit('#/wallet')
  cy.getByTestId('wallets-header').should('be.visible')
})

Given('I click on existing wallet', () => {
  walletPage.clickOnTopWallet()
})

Given('I have unlocked wallet', () => {
  cy.get('body').then($body => {
    if ($body.find(`[data-testid=${walletPage.generateKeyPairBtn}]`).length) {
    } else {
      cy.visit('#/wallet')
      walletPage.clickOnTopWallet()
      walletPage.submitPassphrase('123')
    }
    walletPage.validateUnlockedIconDisplayed()
  })
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

When('I click on key pair', () => {
  walletPage.clickOnTopKeyPair()
})

When('I click on copy public key', () => {
  walletPage.copyTopPublicKey()
})

When('I click lock', () => {
  walletPage.clickLockWallet()
})

When('I sign message with correct passphrase', () => {
  keyPairPage.signmessage('Sign message successfully')
  walletPage.submitPassphrase('123')
})

When('I sign more with correct passphrase', () => {
  keyPairPage.clickSignMore()
  keyPairPage.signmessage('Additional text')
  walletPage.submitPassphrase('123')
})

When('I sign message with incorrect passphrase', () => {
  keyPairPage.signmessage('Sign message unsuccessfully')
  walletPage.submitPassphrase('777')
})

Then('Wallets should be displayed on the page', () => {
  walletPage.validateWalletsDisplayed()
})

Then('wrong passphrase is displayed', () => {
  walletPage.verifyErrorToastTxtIsDisplayed('Error: wrong passphrase')
})

Then('wallet is unlocked', () => {
  walletPage.validateWalletUnlocked()
})

Then('new keypair is generated', () => {
  walletPage.validateNumberOfKeyPairs(2)
})

Then('I am redirected to key pair page', () => {
  walletPage.validateUrl('/wallet/keypair')
  keyPairPage.validatePageDisplayed()
})

Then('public key is copied', () => {
  walletPage.validateCopyKeyBtn()
})

Then('wallet is locked', () => {
  walletPage.validateLockIconDisplayed()
})

Then('message signed successfully', () => {
  keyPairPage.validateMessageSignedSuccessfully()
})
