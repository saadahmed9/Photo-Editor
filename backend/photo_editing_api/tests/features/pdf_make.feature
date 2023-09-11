Feature: PDF maker operation
  Scenario: Input photos needs to be merged into pdf based on user input
    Given PDF maker API is up and running
    When User clicks on PDF maker operation
    Then verify that PDF maker operation is working