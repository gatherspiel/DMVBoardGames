import type { BaseReducer } from "../../update/BaseReducer.ts";

export interface InitStoreConfig {
  storeName: string;
  dataSource: BaseReducer;
  requestData: any;
  dependencyUpdates: () => void;
}
