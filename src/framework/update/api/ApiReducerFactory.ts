import type { DefaultApiAction } from "./DefaultApiAction.ts";
import { BaseGetAction } from "./BaseGetAction.ts";
import { BaseDispatcher } from "../BaseDispatcher.ts";
import { BaseReducer } from "../BaseReducer.ts";

export type DispatcherItem = {
  updateFunction: (a: any) => any;
  componentStore: string;
};

export type ApiReducerConfig = {
  queryUrl: (a: any) => string;
  defaultFunctionConfig: DefaultApiAction;
  dispatcherItems: DispatcherItem[];
};

export function generateGetApiReducer(config: ApiReducerConfig) {
  const getAction = new BaseGetAction(
    config.queryUrl,
    config.defaultFunctionConfig,
  );

  const dispatcherItems: BaseDispatcher[] = [];
  config.dispatcherItems.forEach(function (item) {
    dispatcherItems.push(
      new BaseDispatcher(item.componentStore, item.updateFunction),
    );
  });
  return new BaseReducer(getAction, dispatcherItems);
}
