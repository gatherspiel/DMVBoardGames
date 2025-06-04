import type { BaseThunk } from "../../store/update/BaseThunk.ts";

export type RequestStoreItem = {
  storeName: string;
  dataSource: BaseThunk;
};

export type ThunkReducerConfig = {
  thunk: BaseThunk;
  reducerFunction: (a: any) => any;
  reducerField?: string;
};

export type ComponentLoadConfig = {
  onLoadStoreConfig?: RequestStoreItem;
  onLoadRequestData?: any;
  onLoadInitStore?: () => any;
  onLoadRequestConfig?: RequestStoreItem[];
  requestStoresToCreate?: RequestStoreItem[];
  thunkReducers?: ThunkReducerConfig[];
};

export const validComponentLoadConfigFields = [
  "onLoadStoreConfig",
  "onLoadRequestData",
  "onLoadInitStore",
  "onLoadRequestConfig",
  "requestStoresToCreate",
  "thunkReducers",
];
