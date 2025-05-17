import type { DefaultResponse } from "./DefaultResponse.ts";
import { BaseRequest } from "../BaseRequest.ts";
import { getResponseData } from "../../state/RequestStateManager.ts";

export class BaseGetRequest extends BaseRequest {
  mockResponse: DefaultResponse;
  getQueryUrl: (a: any) => string;

  constructor(getQueryUrl: (a: any) => string, mockResponse: DefaultResponse) {
    super();
    this.getQueryUrl = getQueryUrl;
    this.mockResponse = mockResponse;
  }

  async retrieveData(params: any): Promise<any> {
    const baseGet: BaseGetRequest = this;
    return await getResponseData(
      baseGet.getQueryUrl(params),
      baseGet.mockResponse,
    );
  }
}
