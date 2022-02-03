
Feature: Wallets page

  Scenario: Wallet page displayed
    Given I have an existing Vega wallet
    And I am on the wallets page
    Then Wallets should be displayed on the page

  Scenario: Wallet details page
    Given I click on existing wallet
    When I enter correct passphrase
    Then I am redirected to wallet details page

  Scenario: Wrong passphrase
    Given I am on the wallets page
    And I click on existing wallet
    When I enter wrong passphrase
    Then wrong passphrase is displayed

  Scenario: Generate new key pair
    Given I am on wallet details page
    When I click generate Keypair
    And enter passphrase
    Then new keypair is generated
  @todo
  Scenario: Copy public key
    Given I am on wallet details page
    When I click on copy public key
    Then public key is copied
  @todo
  Scenario: Key pair page
    Given I am on wallet details page
    When I click on key pair
    Then I am redirected to key pair page
  @todo
  Scenario: Go to Docs
    When I click on Docs
    Then I am redirected to Docs page
  @todo
  Scenario: Go to Github
    When I click on Github
    Then I am redirected to Github page
