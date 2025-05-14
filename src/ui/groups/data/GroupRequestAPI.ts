import { API_ROOT } from "../../../utils/params.js";
import { getResponseData } from "../../../framework/state/RequestStateManager.ts";
import { updateComponentState } from "../../../framework/state/ComponentStateManager.ts";
import { GROUP_COMPONENT_STATE } from "../Constants.js";

export class GroupRequestAPI {
  getGroupsQueryUrl(requestParams: any) {
    return API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`;
  }

  async retrieveData(requestParams: any) {
    return await getResponseData(this.getGroupsQueryUrl(requestParams));
  }

  async updateData(response: any) {
    updateComponentState(
      GROUP_COMPONENT_STATE,
      function (data) {
        return data;
      },
      response,
    );
  }
}
