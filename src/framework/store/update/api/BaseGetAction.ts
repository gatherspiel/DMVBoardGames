import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseThunkAction } from "../BaseThunkAction.ts";
import { getResponseData } from "../../data/RequestStore.ts";

export const ApiActionTypes = Object.freeze({
  GET: "GET",
});

export type ApiRequestCofnig = {
  url: string;
  method: typeof ApiActionTypes;
  headers?: Record<string, string>;
  body?: any;
};
export class BaseGetAction extends BaseThunkAction {
  defaultResponse: DefaultApiAction;
  getQueryUrl: (a: any) => string;

  constructor(
    getQueryUrl: (a: any) => string,
    defaultResponse: DefaultApiAction,
  ) {
    super();
    this.getQueryUrl = getQueryUrl;
    this.defaultResponse = defaultResponse;
  }

  /**
   * TODO:
   * - Rename getQueryUrl to getQueryConfig
   * - Rename this class to BaseApiAction.ts
   * - Make sure retrieveData sets the token before sending the request
   * @param params
   */
  async retrieveData(params: any): Promise<any> {
    const baseGet: BaseGetAction = this;

    return await getResponseData(
      baseGet.getQueryUrl(params),
      baseGet.defaultResponse,
    );
  }
}
