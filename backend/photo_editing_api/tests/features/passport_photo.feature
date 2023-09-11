Feature: Passport photo operation
  Scenario: Input photo needs to be converted into passport photo based on user input
    Given Passport creation API is up and running
    When User clicks on Passport creation operation
    Then verify that Passport creation operation is working