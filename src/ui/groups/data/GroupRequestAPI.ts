import { API_ROOT } from "../../../utils/params.js";
import { getResponseData } from "../../../framework/state/RequestStateManager.ts";
import { updateComponentState } from "../../../framework/state/ComponentStateManager.ts";
import { GROUP_COMPONENT_STATE } from "../Constants.js";
import { getAccessToken } from "../../auth/AuthUtils.ts";
export class GroupRequestAPI {
  getGroupsQueryUrl(requestParams: any) {
    return API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`;
  }

  /*
    TODO

    -Read access token from session state.
    -Make sure access token is sent with the API request.
    -Move access token logic to utils file that can be used elsewhere.
    -Retrieve permission from response
    -If the API response indicates edit permissions, show an edit group UI.
    -Make another API call for saving the data. If saving the data succeeds, show a success message. If saving the data fails,
    show an error message. This should happen if there is an endpoint error or there are insufficient permissions.
   */
  async retrieveData(requestParams: any) {
    console.log(getAccessToken());
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
