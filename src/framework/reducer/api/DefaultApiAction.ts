/**
 * Default response for API calls.
 */
export interface DefaultApiAction {
  /**
   * Function to run when the API endpoint throws an error or is disabled.
   * @param info
   */
  defaultFunction?: (info?: any) => any; //Function to run when

  /**
   * Function to run when an API endpoint should be disabled due to permission restrictions or running mocks for
   * development and testing.
   * @param defaultFunctionPriority.
   */
  defaultFunctionPriority: boolean; //Should the function
}
