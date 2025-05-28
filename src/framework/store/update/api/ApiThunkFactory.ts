import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseThunk } from "../BaseThunk.ts";
import { ExternalAction } from "./ExternalAction.ts";
import { BaseGetAction } from "./BaseGetAction.ts";

export type DispatcherItem = {
  updateFunction: (a: any) => any;
  componentStore: string;
  field?: string;
};

export type ApiReducerConfig = {
  queryUrl: (a: any) => string;
  defaultFunctionConfig: DefaultApiAction;
};

export function generateGetApiReducer(config: ApiReducerConfig) {
  const getAction = new BaseGetAction(
    config.queryUrl,
    config.defaultFunctionConfig,
  );

  return new BaseThunk(getAction);
}

export function generateApiReducerWithExternalClient(
  retrieveData: (a: any, b: DefaultApiAction) => Promise<any>,
  defaultResponse: DefaultApiAction,
) {
  const action = new ExternalAction(retrieveData, defaultResponse);
  return new BaseThunk(action);
}
