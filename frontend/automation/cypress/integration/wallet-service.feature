Feature: Wallet Service Page

  Scenario: Wallet service running
    Given I have an existing Vega wallet
    And I have an imported network
    Then wallet service is shown as running
    And wallet service is returning "200"

Scenario: Service with Token DApp
    Given I am on the Wallet Service page
    When I click start service for Token dApp
    And dApp running is shown
    And dApp service is returning "200"

@todo
  Scenario: Service with console
    Given I am on the Wallet Service page
    When I click “Start service with Console”
    Then I am redirected to console
    And dApp running is shown

