import { API_ROOT } from "../../../utils/params.js";
import { getResponseData } from "../../../framework/store/RequestStore.ts";
import { updateComponentStore } from "../../../framework/store/ComponentStore.ts";
import { GROUP_COMPONENT_STATE } from "../Constants.js";

export class GroupRequestAPI {
  getGroupsQueryUrl(requestParams: any) {
    return API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`;
  }

  async retrieveData(requestParams: any) {
    return await getResponseData(this.getGroupsQueryUrl(requestParams));
  }

  async updateData(response: any) {
    updateComponentStore(
      GROUP_COMPONENT_STATE,
      function (data) {
        return data;
      },
      response,
    );
  }
}
