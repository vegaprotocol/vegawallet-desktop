
Feature: Onboarding tests

  Scenario: Create new wallet
    Given I am on the onboarding page
    When I submit wallet details
    Then wallet is successfully created
    When I click import network
    And import "fairground" network
    Then network is imported successfully
    And test wallet is cleaned

  Scenario: Import wallet
    Given I am on the onboarding page
    And I click use recovery phrase
    When I submit a existing recovery phrase
    Then wallet is successfully imported
    And test wallet is cleaned

  Scenario: Submit form with blank fields
    Given I am on the onboarding page
    When I click Import by recovery phrase
    And I click submit
    Then empty fields are marked required

  Scenario: Import wallet with incorrect recovery phrase
    Given I am on the onboarding page
    When I click Import by recovery phrase
    And I fill in details with incorrect recovery phrase
    Then error shown for incorrect recovery phrase
