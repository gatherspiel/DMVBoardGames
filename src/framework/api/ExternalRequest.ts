import { BaseRequest } from "./BaseRequest.ts";
import type { DefaultResponse } from "./DefaultResponse.ts";

export class ExternalRequest extends BaseRequest {
  externalClient: (params: any, defaultResponse: DefaultResponse) => any;
  defaultResponse: DefaultResponse;

  constructor(
    externalClient: (params: any, defaultResponse: DefaultResponse) => any,
    defaultResponse: DefaultResponse,
  ) {
    super();
    this.externalClient = externalClient;
    this.defaultResponse = defaultResponse;
  }

  async retrieveData(params: any): Promise<any> {
    const externalRequest: ExternalRequest = this;

    return await externalRequest.externalClient(
      params,
      externalRequest.defaultResponse,
    );
  }
}
