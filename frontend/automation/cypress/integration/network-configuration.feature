
Feature: Network Configuration page

  Scenario: Change network
    Given I have more than one imported network
    When I change network to "testnet"
    Then Current network is now "testnet"
    When I change network to "mainnet1"
    Then Current network is now "mainnet1"

  Scenario: View network details
    Given I am on the Network configuration page
    When I change network to "testnet"
    Then network details for "testnet" is displayed

  Scenario: Edit network details displayed
    Given I am on the Network configuration page
    When I navigate to edit network page
    Then I am redirected to edit network page
