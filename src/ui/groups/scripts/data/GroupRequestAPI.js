import { API_ROOT } from "../../../../utils/params.js";
import { getResponseData } from "../../../../framework/state/RequestStateManager.js";

export class GroupRequestAPI {
  getGroupsQueryUrl(requestParams) {
    return API_ROOT + `/groups/?groupName=${requestParams.groupName}`;
  }

  async retrieveData(requestParams) {
    console.log("Request params:" + JSON.stringify(requestParams));
    return await getResponseData(this.getGroupsQueryUrl(requestParams));
  }

  async updateData(response) {
    console.log("Response:" + response);
  }
}
