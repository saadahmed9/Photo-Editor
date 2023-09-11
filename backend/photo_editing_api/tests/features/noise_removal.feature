Feature: Noise removal operation
  Scenario: Input photo needs to be cleaned based on user input
    Given Noise removal API is up and running
    When User clicks on Noise removal operation
    Then verify that Noise removal operation is working