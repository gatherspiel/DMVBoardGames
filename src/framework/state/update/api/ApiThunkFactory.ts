import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseThunk } from "../BaseThunk.ts";
import { ExternalApiAction } from "./ExternalApiAction.ts";
import { InternalApiAction } from "./InternalApiAction.ts";
import type { ApiRequestConfig } from "./types/ApiRequestConfig.ts";
import { subscribeToRequestStore } from "../../data/RequestStore.ts";

export type ApiThunkConfig = {
  queryConfig: (a: any) => ApiRequestConfig;
  defaultFunctionConfig?: DefaultApiAction;
  requestStoreName?: string;
};

export function generateApiThunk(config: ApiThunkConfig) {

  let defaultFunctionConfig = config.defaultFunctionConfig;
  if(!defaultFunctionConfig){
    defaultFunctionConfig = {
      defaultFunction: function (response: any) {
        return {
          errorMessage: response.message,
        };
      },
      defaultFunctionPriority: false,
    };
  }
  const getAction = new InternalApiAction(
    config.queryConfig,
    defaultFunctionConfig,
  );

  const apiThunk = new BaseThunk(getAction);
  if (config.requestStoreName) {
    subscribeToRequestStore(config.requestStoreName, apiThunk);
  }
  return apiThunk;
}

export function generateApiThunkWithExternalConfig(
  retrieveData: (a: any, b: DefaultApiAction) => Promise<any>,
  defaultResponse: DefaultApiAction,
) {
  const action = new ExternalApiAction(retrieveData, defaultResponse);
  return new BaseThunk(action);
}
