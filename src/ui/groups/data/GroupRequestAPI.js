import { API_ROOT } from "../../../utils/params.js";
import { getResponseData } from "../../../framework/state/RequestStateManager.ts";
import { updateComponentState } from "../../../framework/state/ComponentStateManager.ts";
import { GROUP_COMPONENT_STATE } from "../Constants.js";

export class GroupRequestAPI {
  getGroupsQueryUrl(requestParams) {
    return API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`;
  }

  async retrieveData(requestParams) {
    return await getResponseData(this.getGroupsQueryUrl(requestParams));
  }

  async updateData(response) {
    updateComponentState(
      GROUP_COMPONENT_STATE,
      function (data) {
        return data;
      },
      response,
    );
  }
}
