Feature: Format change operation
  Scenario: Input photo format needs to be changed based on user input
    Given Format change API is up and running
    When User clicks on Format change operation
    Then verify that Format change operation is working