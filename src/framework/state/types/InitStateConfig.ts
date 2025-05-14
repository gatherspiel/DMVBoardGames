import type { BaseAPI } from "../../api/BaseAPI.ts";

export interface InitStateConfig {
  stateName: string;
  dataSource: BaseAPI;
  requestData: any;
  dependencyUpdates: () => void;
}
