Feature: Background change operation
  Scenario: Input photo's background needs to be updated based on user input
    Given Background change API is up and running
    When User clicks on background change operation
    Then verify that background change operation is working