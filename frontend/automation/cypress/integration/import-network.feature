
Feature: Import network

  Scenario: Import network using dropdown
    Given I open the network drawer
    When I select "fairground" on the dropdown
    And Import is clicked
    Then new network is added
    And network page is populated with "fairground" as expected

  Scenario: Import successfully using url
    Given I open the network drawer
    When I import using valid network import url
    Then new network is added

  Scenario: Import unsuccessfully using url
    Given I open the network drawer
    When I import using unknown network import url
    Then network is not added

  Scenario: Overwrite network that already exists
    Given I open the network drawer
    When I import using valid network import url
    Then network with same name error is shown
    And overwrite is clicked
    And Import is clicked
    And new network is added

  Scenario: Import same network with different name
    Given I open the network drawer
    When I import using url and specify network name
    Then new network is added

  Scenario: Import successfully via file path
    Given I have downloaded network config file
    And I open the network drawer
    When I import using valid network import file path
    Then new network is added

  Scenario: Import unsuccessfully via file path
    Given I open the network drawer
    When I import using invalid network import file path
    Then file path error is displayed
