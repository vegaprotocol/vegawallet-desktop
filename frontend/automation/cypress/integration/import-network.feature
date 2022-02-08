@todo
Feature: Import network

  Scenario: Import successfully using url
    Given I am on the import network page
    When I enter Url “”
    And enter network name “”
    And click submit
    Then new network is added

  Scenario: Import unsuccessfully using url
    Given I am on the import network page
    When I enter Url “”
    And enter existing network name “” (do not click overwrite)
    And click submit
    Then network is not added

  Scenario: Import successfully via file path
    Given I am on the import network page
    When I enter file path “”
    And enter network name
    And click submit
    Then new network is added

  Scenario: Import unsuccessfully via file path
    Given I am on the import network page
    When I enter file path “”
    And enter network name
    And click submit
    Then network is not added
