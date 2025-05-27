import { BaseThunkAction } from "../BaseThunkAction.ts";
import type { DefaultApiAction } from "./DefaultApiAction.ts";

export class ExternalAction extends BaseThunkAction {
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
    const externalRequest: ExternalAction = this;

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
