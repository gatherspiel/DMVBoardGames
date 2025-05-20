import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseReducerAction } from "../BaseReducerAction.ts";
import { getResponseData } from "../../store/RequestStore.ts";

export class BaseGetAction extends BaseReducerAction {
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
