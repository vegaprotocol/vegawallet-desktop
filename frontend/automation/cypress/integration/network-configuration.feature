@todo
Feature: Network Configuration page

  Scenario: Change network
    Given I am on the Network configuration page
    When I click Change
    And select “Mainnet1”
    Then Current network is now “Mainnet1”

  Scenario: View network details
    Given I am on the Network configuration page
    When I click view on “stagnet”
    Then I am redirected to “stagenet” page

  Scenario: Edit network details
    Given I am on the Network configuration page
    When I click edit on “stagnet”
    Then I am redirected to edit “stagnet” page
  # (possibly more steps to check validation)

  # Scenario: Go to import network page
  #   Given I am on the Network configuration page
  #   When I click on import network
  #   Then I am redirected to add network page
