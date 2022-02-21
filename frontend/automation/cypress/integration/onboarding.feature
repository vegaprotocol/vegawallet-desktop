@ignore
Feature: Onboarding tests

  Scenario: Create new wallet
    Given I click create new wallet
    When I submit wallet details
    Then wallet is successfully created

  Scenario: Import wallet
    Given I click use recovery phrase
    When I submit a existing recovery phrase
    Then wallet is successfully imported
