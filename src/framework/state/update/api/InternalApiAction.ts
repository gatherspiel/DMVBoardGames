import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseThunkAction } from "../BaseThunkAction.ts";

import type { ApiRequestConfig } from "./types/ApiRequestConfig.ts";
import { ApiActionTypes } from "./types/ApiActionTypes.ts";
export class InternalApiAction extends BaseThunkAction {
  readonly #defaultResponse: DefaultApiAction;
  readonly #getQueryConfig: (a: any) => ApiRequestConfig;

  constructor(
    getQueryConfig: (a: any) => ApiRequestConfig,
    defaultResponse: DefaultApiAction,
  ) {
    super();
    this.#getQueryConfig = getQueryConfig;
    this.#defaultResponse = defaultResponse;
  }

  static #defaultApiErrorResponse = function (responseData: any) {
    throw new Error(JSON.stringify(responseData, null, 2));
  };

  static #defaultApiSuccessResponse = function () {
    return { status: 200 };
  };

  async #getResponseData(
    queryConfig: ApiRequestConfig,
    mockSettings?: DefaultApiAction,
  ) {
    const url = queryConfig.url;
    const useDefault = mockSettings?.defaultFunctionPriority;

    try {
      if (!useDefault) {
        //The replace call is a workaround for an issue with url strings containing double quotes"
        const response = await fetch(url.replace(/"/g, ""), {
          method: queryConfig.method ?? ApiActionTypes.GET,
          headers: queryConfig.headers,
          body: queryConfig.body,
        });
        if (response.status !== 200) {
          console.warn(
            "Did not retrieve data from API. Mock data will be used",
          );

          let message = "";

          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            message = await response.json();
          } else {
            if (response.status === 404) {
              message = `Endpoint ${url} not found`;
            } else {
              message = await response.text();
            }
          }

          const responseData: any = {
            status: response.status,
            message: message,
            endpoint: url,
          };

          return mockSettings?.defaultFunction
            ? mockSettings?.defaultFunction(responseData)
            : InternalApiAction.#defaultApiErrorResponse(responseData);
        }

        const contentType = response.headers.get("content-type");
        if (contentType === "application/json") {
          const result = await response.json();
          return result;
        }

        return InternalApiAction.#defaultApiSuccessResponse;
      }
    } catch (e: any) {
      const responseData: any = {
        status: null,
        message: e.message,
        endpoint: url,
      };

      return mockSettings?.defaultFunction
        ? mockSettings?.defaultFunction(responseData)
        : InternalApiAction.#defaultApiErrorResponse(responseData);
    }
    return mockSettings?.defaultFunction ? mockSettings.defaultFunction() : {};
  }

  /**
   * @param params
   */
  async retrieveData(params: any): Promise<any> {
    //const baseGet: BaseGetAction = this;

    return await this.#getResponseData(
      this.#getQueryConfig(params),
      this.#defaultResponse,
    );
  }
}
