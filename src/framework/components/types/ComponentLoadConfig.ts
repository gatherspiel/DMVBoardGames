import type { BaseThunk } from "../../state/update/BaseThunk.ts";
import type {PreloadThunk} from "../../state/update/PreloadThunk.ts";

export type RequestStoreItem = {
  dataSource: BaseThunk;
  disableCache?: boolean;
  preloadData?:PreloadThunk
};

export type ThunkDispatcherConfig = {
  thunk: BaseThunk;
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
  thunkReducers?: ThunkDispatcherConfig[];
  globalStateLoadConfig?: GlobalStateLoadConfig;
};

export const validComponentLoadConfigFields = [
  "onLoadStoreConfig",
  "onLoadRequestData",
  "onLoadInitStore",
  "onLoadRequestConfig",
  "thunkReducers",
  "globalStateLoadConfig",
];
