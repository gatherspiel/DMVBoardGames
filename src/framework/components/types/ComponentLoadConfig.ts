import type { BaseThunk } from "../../store/update/BaseThunk.ts";

export type RequestStoreItem = {
  storeName: string;
  dataSource: BaseThunk;
  disableCache?: boolean;
};

export type ThunkDispatcherConfig = {
  thunk: BaseThunk;
  componentStoreReducer: (a: any) => any;
  globalStoreReducer?: (a: any) => any;
  reducerField?: string;
};

export type GlobalStateLoadConfig = {
  globalFieldSubscriptions: string[];
  waitForGlobalState?: string; //Wait for this global state to be ready before loading.
  defaultGlobalStateReducer?: (updates: Record<string, string>) => any; //Default reducer from global state if there is no dependent API request.
};

export type ComponentLoadConfig = {
  onLoadStoreConfig?: RequestStoreItem;
  onLoadRequestData?: any;
  onLoadInitStore?: () => any;
  onLoadRequestConfig?: RequestStoreItem[];
  requestStoresToCreate?: RequestStoreItem[];
  thunkReducers?: ThunkDispatcherConfig[];
  globalStateLoadConfig?: GlobalStateLoadConfig;
};

export const validComponentLoadConfigFields = [
  "onLoadStoreConfig",
  "onLoadRequestData",
  "onLoadInitStore",
  "onLoadRequestConfig",
  "requestStoresToCreate",
  "thunkReducers",
  "globalStateLoadConfig",
];
