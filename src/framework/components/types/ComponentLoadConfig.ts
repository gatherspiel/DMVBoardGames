import type { BaseThunk } from "../../state/update/BaseThunk.ts";

export type RequestStoreItem = {
  dataSource: BaseThunk;
  disableCache?: boolean;
  preloadData?:BaseThunk
};

export type RequestThunkReducerConfig = {
  thunk: BaseThunk
  componentStoreReducer: (a: any) => any;
  globalStoreReducer?: (a: any) => any;
  reducerField?: string;
};

export type GlobalStateLoadConfig = {
  globalFieldSubscriptions: string[];
  defaultGlobalStateReducer?: (updates: Record<string, string>) => any; //Default reducer from global state if there is no dependent API request.
};

export type ComponentLoadConfig = {
  onLoadStoreConfig?: RequestStoreItem;
  onLoadRequestData?: any;
  onLoadInitStore?: () => any;
  onLoadRequestConfig?: RequestStoreItem[];
  requestThunkReducers?: RequestThunkReducerConfig[];
  globalStateLoadConfig?: GlobalStateLoadConfig;
};

export const validComponentLoadConfigFields = [
  "onLoadStoreConfig",
  "onLoadRequestData",
  "onLoadInitStore",
  "onLoadRequestConfig",
  "requestThunkReducers",
  "globalStateLoadConfig",
];
