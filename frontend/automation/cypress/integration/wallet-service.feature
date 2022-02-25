Feature: Wallet Service Page


  Scenario: Service with Token DApp
    Given I have an imported network
    When I click start service for Token dApp
    And dApp "token" is shown running
    And dApp service is returning "200"

  Scenario: Service with console
    Given I am on the Wallet Service page
    When I click start service with console
    Then dApp "console" is shown running
    And console service is returning "200"

  Scenario: Wallet service running
    Given I am on the Wallet Service page
    Then wallet service is shown as running
    And wallet service is returning "200"
