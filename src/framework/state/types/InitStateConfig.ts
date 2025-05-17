import type { BaseUpdater } from "../../update/BaseUpdater.ts";

export interface InitStateConfig {
  stateName: string;
  dataSource: BaseUpdater;
  requestData: any;
  dependencyUpdates: () => void;
}
