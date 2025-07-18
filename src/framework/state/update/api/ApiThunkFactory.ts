import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseThunk } from "../BaseThunk.ts";
import { ExternalApiAction } from "./ExternalApiAction.ts";
import { InternalApiAction } from "./InternalApiAction.ts";
import type { ApiRequestConfig } from "./types/ApiRequestConfig.ts";

export type ApiThunkConfig = {
  queryConfig: (a: any) => ApiRequestConfig;
  defaultFunctionConfig?: DefaultApiAction;
  requestStoreName?: string;
};

let thunkCount = 0;

export function generateApiThunk(config: ApiThunkConfig) {

  let defaultFunctionConfig = config.defaultFunctionConfig;
  if(!defaultFunctionConfig){
    defaultFunctionConfig = {
      defaultFunction: function (response: any) {
        return {
          errorMessage: response.message,
        };
      },
    };
  }
  const getAction = new InternalApiAction(
    config.queryConfig,
    defaultFunctionConfig,
  );

  const apiThunk = new BaseThunk(getAction);

  const requestStoreId =config.queryConfig.name+"_"+thunkCount;
  apiThunk.createRequestStore(requestStoreId);
  thunkCount++;

  return apiThunk;
}

export function generateApiThunkWithExternalConfig(
  retrieveData: (a: any, b: DefaultApiAction) => Promise<any>,
  defaultResponse: DefaultApiAction,
):BaseThunk {
  const action = new ExternalApiAction(retrieveData, defaultResponse);

  const requestStoreId ="api_request_"+thunkCount;

  const thunk = new BaseThunk(action);
  thunk.createRequestStore(requestStoreId);
  thunkCount++;

  return thunk;
}
