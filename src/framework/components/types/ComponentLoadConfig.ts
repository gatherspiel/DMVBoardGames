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

/**
 * Global state that the component depends on. The component will not be rendered until the global state
 * is ready.
 */
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
  defaultComponentState?:any
};

export const validComponentLoadConfigFields = [
  "onLoadStoreConfig",
  "onLoadRequestData",
  "onLoadInitStore",
  "onLoadRequestConfig",
  "requestThunkReducers",
  "globalStateLoadConfig",
  "defaultComponentState"
];
