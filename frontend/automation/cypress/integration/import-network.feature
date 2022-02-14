Feature: Import network

  Scenario: Import successfully using url
    Given I am on the import network page
    When I import using valid network import url
    Then new network is added
    And network page is populated as expected
@todo
  Scenario: Import unsuccessfully using url
    Given I am on the import network page
    When I import using unknown network import url
    Then network is not added

  Scenario: Import network that already exists
    Given I am on the import network page
    When I import using valid network import url
    Then network is not added
    When overwrite is clicked
    And I import using valid network import url
    Then new network is added

  Scenario: Import same network with different name
    Given I am on the import network page
    When I import using url and specify network name
    Then new network is added

  @todo
  Scenario: Import successfully via file path
    Given I am on the import network page
    When I import using valid network import file path
    Then new network is added

@todo
  Scenario: Import unsuccessfully via file path
    Given I am on the import network page
    When I enter file path “”
    And enter network name
    And click submit
    Then network is not added
