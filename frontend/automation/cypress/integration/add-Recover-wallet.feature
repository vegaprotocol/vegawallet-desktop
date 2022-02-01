@todo
Feature: Add/Recover wallet page

  Scenario: Create new wallet
    Given I am on the Add/Recover wallet page
    When I click “create new”
    And I enter wallet details
    Then a new wallet should be created

  Scenario: Recover wallet
    Given I am on the Add/Recover wallet page
    When I click “Import by recovery phrase”
    And fill in details for wallet recovery
    Then wallet should be recovered

  Scenario: Incorrect recovery phrase
    Given I am on the Add/Recover wallet page
    When I click “Import by recovery phrase”
    And fill in “incorrect” recovery phrase
    Then error message should be displayed

  Scenario: Invalid recovery phrase
    Given I am on the Add/Recover wallet page
    When I click “Import by recovery phrase”
    And fill in “invalid” recovery phrase
    Then error message should be displayed
