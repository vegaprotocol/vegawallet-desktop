Feature: Transaction approval

  Scenario: Transaction approved
    Given I have an existing wallet
    And wallet service is shown as running
    When an order transaction is sent
    Then the transaction dialog is opened
    When I approve the transaction
    Then the transaction dialog is closed
    And the transaction is approved

  Scenario: Transaction rejected
    When an order transaction is sent
    Then the transaction dialog is opened
    When I reject the transaction
    Then the transaction dialog is closed
    And the transaction is rejected

  Scenario: Transaction display
    When an order transaction is sent
    Then the transaction dialog displays correctly

  Scenario: Multiple transactions
    When an order transaction is sent
    And a vote transaction is sent
    Then both transactions are shown

