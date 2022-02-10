
Feature: Add/Recover wallet page

  Scenario: Recover wallet
    Given I am on the wallets page
    When I click Import by recovery phrase
    And fill in details for wallet recovery
    Then wallet should be recovered
    And public key is as expected

  Scenario: Recover wallet with the same wallet name
    Given I am on the wallets page
    When I click Import by recovery phrase
    And fill in details for wallet recovery
    Then error shown for wallet already exists

  Scenario: Recover wallet with the same recovery phrase different name
    Given I am on the wallets page
    When I click Import by recovery phrase
    And fill in details for wallet recovery with different name
    Then wallet should be recovered

   Scenario: Recover wallet with the different version
    Given I am on the wallets page
    When I click Import by recovery phrase
    And fill in details for wallet recovery with version 1
    Then wallet should be recovered

  Scenario: Submit form with blank fields
    Given I am on the wallets page
    When I click Import by recovery phrase
    And I click submit
    Then empty fields are marked required

  Scenario: Import wallet with incorrect recovery phrase
    Given I am on the wallets page
    When I click Import by recovery phrase
    And I fill in details with incorrect recovery phrase
    Then error shown for incorrect recovery phrase

  @todo
  Scenario: Invalid recovery phrase
    Given I am on the wallets page
    When I click “Import by recovery phrase”
    And fill in “invalid” recovery phrase
    Then error message should be displayed
