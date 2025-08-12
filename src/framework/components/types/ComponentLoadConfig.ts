import type { BaseThunk } from "../../state/update/BaseThunk.ts";

export const ON_LOAD_STORE_CONFIG_KEY = "onLoadStoreConfig"
export const ON_LOAD_REQUEST_DATA_KEY = "onLoadRequestData"
export const ON_LOAD_INIT_STORE_KEY = "onLoadInitStore"
export const ON_LOAD_REQUEST_CONFIG_KEY = "onLoadRequestConfig"
export const REQUEST_THUNK_REDUCERS_KEY  = "requestThunkReducers"
export const GLOBAL_STATE_LOAD_CONFIG_KEY = "globalStateLoadConfig"
export const DEFAULT_COMPONENT_STATE_KEY = "defaultComponentState"
export const GLOBAL_FIELD_SUBSCRIPTIONS_KEY = "globalFieldSubscriptions"
export const DEFAULT_GLOBAL_STATE_REDUCER_KEY = "defaultGlobalStateReducer"

export type RequestStoreItem = {
  dataSource: BaseThunk;
  disableCache?: boolean;
  preloadData?:BaseThunk
};

export type RequestThunkReducerConfig = {
  thunk: BaseThunk
  componentReducer?: (a: any) => any;
  globalStoreReducer?: (a: any) => any;
  reducerField?: string;
};

/**
 * Global state that the component depends on. The component will not be rendered until the global state
 * is ready.
 */
export type GlobalStateLoadConfig = {
  [GLOBAL_FIELD_SUBSCRIPTIONS_KEY]: string[];
  [DEFAULT_GLOBAL_STATE_REDUCER_KEY]?: (updates: any) => any; //Default reducer from global state if there is no dependent API request.
};

export type DataFieldConfig = {
  fieldName: string,
  dataSource: BaseThunk,
  params?:Record<string, string>,
  preloadSource?: BaseThunk
}

export type ComponentLoadConfig = {
  [ON_LOAD_STORE_CONFIG_KEY]?: RequestStoreItem;
  [ON_LOAD_REQUEST_DATA_KEY]?: any;
  [ON_LOAD_INIT_STORE_KEY]?: () => any;
  [ON_LOAD_REQUEST_CONFIG_KEY]?: RequestStoreItem[];
  [REQUEST_THUNK_REDUCERS_KEY]?: RequestThunkReducerConfig[];
  [GLOBAL_STATE_LOAD_CONFIG_KEY]?: GlobalStateLoadConfig;
  [DEFAULT_COMPONENT_STATE_KEY]?:any,
  dataFields?: DataFieldConfig[]
};


export const validComponentLoadConfigFields = [
  ON_LOAD_STORE_CONFIG_KEY,
  ON_LOAD_REQUEST_DATA_KEY,
  ON_LOAD_INIT_STORE_KEY,
  ON_LOAD_REQUEST_CONFIG_KEY,
  REQUEST_THUNK_REDUCERS_KEY,
  GLOBAL_STATE_LOAD_CONFIG_KEY,
  DEFAULT_COMPONENT_STATE_KEY,
  "dataFields"
];
