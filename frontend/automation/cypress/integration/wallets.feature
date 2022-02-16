
Feature: Wallets page

  Scenario: Wallet page displayed
    Given I have an existing Vega wallet
    And I am on the wallets page
    Then Wallets should be displayed on the page

  Scenario: Wallet details page
    Given I click on existing wallet
    When I enter correct passphrase
    Then wallet is unlocked

  Scenario: Wrong passphrase
    Given I am on the wallets page
    And I click on existing wallet
    When I enter wrong passphrase
    Then wrong passphrase is displayed

  Scenario: Generate new key pair
    Given I have unlocked wallet
    When I click generate Keypair
    And enter passphrase
    Then new keypair is generated

  Scenario: Key pair page
    Given I have unlocked wallet
    When I click on key pair
    Then I am redirected to key pair page

  Scenario: Wallets can be locked
    Given I have unlocked wallet
    When I click lock
    Then wallet is locked

  @ignore
  Scenario: Copy public key
    Given I have unlocked wallet
    And unlocked icon is displayed
    When I click on copy public key
    Then public key is copied
