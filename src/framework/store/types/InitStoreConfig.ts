import type { BaseReducer } from "../../reducer/BaseReducer.ts";

export interface InitStoreConfig {
  storeName: string;
  dataSource: BaseReducer;
  requestData: any;
  dependencyUpdates: () => void;
}
