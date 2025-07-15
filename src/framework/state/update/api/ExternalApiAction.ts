import { BaseThunkAction } from "../BaseThunkAction.ts";
import type { DefaultApiAction } from "./DefaultApiAction.ts";

/**
 * TODO: Add automated testing documentation and examples for instances of ExternalAction without the backend
 *
 * - Instances should be created with a custom defaultResponse that functions as a mock instead of an error handler.
 * - The thunk factory could be used with the unit tests to create a mock.
 *
 */
export class ExternalApiAction extends BaseThunkAction {


  externalClient: (params: any, defaultResponse: DefaultApiAction) => any;
  defaultResponse: DefaultApiAction;
  constructor(
    externalClient: (params: any, defaultResponse: DefaultApiAction) => any,
    defaultResponse: DefaultApiAction,
  ) {
    super();
    this.externalClient = externalClient;
    this.defaultResponse = defaultResponse;
  }

  async retrieveData(params: any): Promise<any> {
    const externalRequest: ExternalApiAction = this;

    try {
      return await externalRequest.externalClient(
        params,
        externalRequest.defaultResponse,
      );
    } catch (e: any) {
      if (this.defaultResponse.defaultFunction) {
        return this.defaultResponse.defaultFunction();
      } else {
        console.error("No custom error response defined for:" + e.message);
      }
    }
  }
}
