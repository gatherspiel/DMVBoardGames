import { BaseRequest } from "./BaseRequest.ts";
import { BaseStateUpdate } from "./BaseStateUpdate.ts";

export class BaseAPI {
  dataFetch: BaseRequest;
  stateUpdate: BaseStateUpdate[];

  constructor(dataFetch: BaseRequest, stateUpdate: BaseStateUpdate[]) {
    this.dataFetch = dataFetch;
    this.stateUpdate = stateUpdate;
  }

  async retrieveData(params: any) {
    return await this.dataFetch.retrieveData(params);
  }

  updateData(response: any) {
    for (let stateUpdate of this.stateUpdate) {
      stateUpdate.updateData(response);
    }
  }
}
