@todo
Feature: Wallets page

  Scenario: Wallet page displayed
    Given I have an existing Vega wallet
    Then Wallets should be displayed on the page

  Scenario: Wrong passphrase
    Given I click on existing wallet
    When I enter wrong passphrase
    Then wrong passphrase is displayed

  Scenario: Wallet details page
    Given I click on existing wallet
    When I enter correct passphrase
    Then I am redirected to wallet details page

  Scenario: Generate new key pair
    Given I am on wallet details page
    When I click generate Keypair
    Then new keypair is generated

  Scenario: Copy public key
    Given I am on wallet details page
    When I click on copy public key
    Then public key is copied

  Scenario: Key pair page
    Given I am on wallet details page
    When I click on key pair
    Then I am redirected to key pair page

  Scenario: Go to Docs
    When I click on Docs
    Then I am redirected to Docs page

  Scenario: Go to Github
    When I click on Github
    Then I am redirected to Github page
