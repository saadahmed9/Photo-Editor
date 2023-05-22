Feature: Photo resize operation
  Scenario: Input photo needs to be resized based on user input
    Given Resize API is up and running
    When User clicks on photo resize operation
    Then verify that resize operation is working