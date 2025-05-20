import { BaseReducerAction } from "../BaseReducerAction.ts";
import type { DefaultApiAction } from "./DefaultApiAction.ts";

export class ExternalReducerAction extends BaseReducerAction {
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
    const externalRequest: ExternalReducerAction = this;

    return await externalRequest.externalClient(
      params,
      externalRequest.defaultResponse,
    );
  }
}
