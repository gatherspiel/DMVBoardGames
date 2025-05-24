import type { BaseReducer } from "../../reducer/BaseReducer.ts";

export type RequestStoreItem = {
  storeName: string;
  dataSource: BaseReducer;
};

export type ReducerFunctionConfig = {
  reducer: BaseReducer;
  reducerFunction: (a: any) => any;
  reducerField?: string;
};

export type ComponentLoadConfig = {
  onLoadStoreConfig?: RequestStoreItem;
  onLoadRequestData?: any;
  onLoadInitStore?: () => any;
  onLoadRequestConfig?: RequestStoreItem[];
  requestStoresToCreate?: RequestStoreItem[];
  reducerSubscriptions?: ReducerFunctionConfig[];
};
