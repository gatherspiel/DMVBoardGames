import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseThunkAction } from "../BaseThunkAction.ts";
import { getResponseData } from "../../data/RequestStore.ts";
import type { ApiRequestConfig } from "./types/ApiRequestConfig.ts";
export class BaseGetAction extends BaseThunkAction {
  defaultResponse: DefaultApiAction;
  getQueryConfig: (a: any) => ApiRequestConfig;

  constructor(
    getQueryConfig: (a: any) => ApiRequestConfig,
    defaultResponse: DefaultApiAction,
  ) {
    super();
    this.getQueryConfig = getQueryConfig;
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
      baseGet.getQueryConfig(params),
      baseGet.defaultResponse,
    );
  }
}
