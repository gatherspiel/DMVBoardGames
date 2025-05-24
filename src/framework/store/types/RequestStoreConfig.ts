import type { BaseReducer } from "../../reducer/BaseReducer.ts";

export type RequestStoreItem = {
  storeName: string;
  dataSource: BaseReducer;
};

export type RequestStoreConfig = {
  onLoadStoreConfig: RequestStoreItem;
  requestData?: any;
  initStore?: () => any;
  dependencyUpdates?: () => any;
  requestStoresToCreate?: RequestStoreItem[];
};
