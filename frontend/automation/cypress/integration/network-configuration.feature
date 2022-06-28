
Feature: Network Configuration page

  Scenario: Change network
    Given I have more than one imported network
    When I change network to "fairground"
    Then Current network is now "fairground"
    When I change network to "mainnet1"
    Then Current network is now "mainnet1"

  Scenario: View network details
    When I change network to "mainnet1"
    Then network details for "mainnet1" is displayed

  Scenario: Edit network details displayed
    Given I open the network drawer
    When I navigate to edit network page
    Then I am redirected to edit network page
