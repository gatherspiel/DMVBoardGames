import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseThunkAction } from "../BaseThunkAction.ts";
import { getResponseData } from "../../data/RequestStore.ts";

export class BaseGetAction extends BaseThunkAction {
  mockResponse: DefaultApiAction;
  getQueryUrl: (a: any) => string;

  constructor(getQueryUrl: (a: any) => string, mockResponse: DefaultApiAction) {
    super();
    this.getQueryUrl = getQueryUrl;
    this.mockResponse = mockResponse;
  }

  async retrieveData(params: any): Promise<any> {
    const baseGet: BaseGetAction = this;
    return await getResponseData(
      baseGet.getQueryUrl(params),
      baseGet.mockResponse,
    );
  }
}
