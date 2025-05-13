import type { MockResponse } from "./MockResponse.ts";
import { BaseRequest } from "./BaseRequest.ts";
import { getResponseData } from "../state/RequestStateManager.ts";

export class BaseGet extends BaseRequest {
  mockResponse: MockResponse;
  getQueryUrl: (a: any) => string;

  constructor(getQueryUrl: (a: any) => string, mockResponse: MockResponse) {
    super();
    this.getQueryUrl = getQueryUrl;
    this.mockResponse = mockResponse;
  }

  async retrieveData(params: any): Promise<any> {
    const baseGet: BaseGet = this;
    return await getResponseData(
      baseGet.getQueryUrl(params),
      baseGet.mockResponse,
    );
  }
}
