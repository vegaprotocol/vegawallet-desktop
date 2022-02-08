
Feature: Add/Recover wallet page
  @todo
  #This is already done
  Scenario: Create new wallet
    Given I am on the wallets page
    When I click “create new”
    And I enter wallet details
    Then a new wallet should be created

  Scenario: Recover wallet
    Given I am on the wallets page
    When I click Import by recovery phrase
    And fill in details for wallet recovery
    Then wallet should be recovered

  @todo
  Scenario: Incorrect recovery phrase
    Given I am on the wallets page
    When I click “Import by recovery phrase”
    And fill in “incorrect” recovery phrase
    Then error message should be displayed
  @todo
  Scenario: Invalid recovery phrase
    Given I am on the wallets page
    When I click “Import by recovery phrase”
    And fill in “invalid” recovery phrase
    Then error message should be displayed
