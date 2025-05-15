/*
 Updates state after an API response is returned
 */
import { updateComponentState } from "../state/ComponentStateManager.ts";

export class BaseStateUpdate {
  stateName: string;
  stateUpdate: (a: any) => any;
  responseField?: string;

  constructor(
    stateName: string,
    stateUpdate: (a: any) => any,
    responseField?: string,
  ) {
    this.stateName = stateName;
    this.stateUpdate = stateUpdate;
    this.responseField = responseField;
  }

  updateData(response: any) {
    const baseUpdate: BaseStateUpdate = this;
    const responseData = this.responseField
      ? response[this.responseField]
      : response;

    updateComponentState(
      baseUpdate.stateName,
      baseUpdate.stateUpdate,
      responseData,
    );
  }
}
