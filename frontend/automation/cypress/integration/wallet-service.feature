@todo
Feature: Wallet Service Page

  Scenario: Wallet Service
    Given I am on the Wallet Service page
    When I click “Start service”
    Then service has started
    # make API check
    And service is running is shown
    When I click stop service
    Then service is stopped

  Scenario: Service with console
    Given I am on the Wallet Service page
    When I click “Start service with Console”
    Then I am redirected to console
    And dApp running is shown

  Scenario: Service with Token DApp
    Given I am on the Wallet Service page
    When I click “Start service with Token dApp”
    Then I am redirected to console
    And dApp running is shown
