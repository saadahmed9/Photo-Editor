Feature: Mosaic maker operation
  Scenario: A mosaic needs to be created for an input image
    Given Mosaic maker API is up and running
    When User clicks on create Mosaic operation
    Then verify that Mosaic maker operation is working