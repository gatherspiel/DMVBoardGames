import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseThunk } from "../BaseThunk.ts";
import { ExternalAction } from "./ExternalAction.ts";
import { BaseGetAction } from "./BaseGetAction.ts";
import type { ApiRequestConfig } from "./types/ApiRequestConfig.ts";

export type ApiThunkConfig = {
  queryConfig: (a: any) => ApiRequestConfig;
  defaultFunctionConfig: DefaultApiAction;
};

export function generateApiThunk(config: ApiThunkConfig) {
  const getAction = new BaseGetAction(
    config.queryConfig,
    config.defaultFunctionConfig,
  );

  return new BaseThunk(getAction);
}

export function generateApiThunkWithExternalConfig(
  retrieveData: (a: any, b: DefaultApiAction) => Promise<any>,
  defaultResponse: DefaultApiAction,
) {
  const action = new ExternalAction(retrieveData, defaultResponse);
  return new BaseThunk(action);
}
