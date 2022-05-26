
Feature: Transaction approval

  Background:
    Given I have an existing wallet
    And wallet service is shown as running

  Scenario: Transaction approved
    And an order transaction is sent
    Then the transaction dialog is opened
    And I approve the transaction
    Then the transaction dialog is closed
    And the transaction is approved 

  Scenario: Transaction rejected
    And an order transaction is sent
    Then the transaction dialog is opened
    And I reject the transaction
    Then the transaction dialog is closed
    And the transaction is rejected

  Scenario: Transaction display
    And an order transaction is sent
    Then the transaction dialog displays correctly

  Scenario: Multiple transactions
    And an order transaction is sent
    And a vote transaction is sent
    Then both transactions are shown

