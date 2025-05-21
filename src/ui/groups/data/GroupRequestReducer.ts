import { API_ROOT } from "../../../utils/params.js";
import { generateGetApiReducer } from "../../../framework/reducer/api/ApiReducerFactory.ts";

function getGroupsQueryUrl(requestParams: any) {
  return API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`;
}

const defaultFunctionConfig = {
  defaultFunction: function () {
    return {};
  },
  defaultFunctionPriority: false,
};
export const GROUP_REQUEST_REDUCER = generateGetApiReducer({
  queryUrl: getGroupsQueryUrl,
  defaultFunctionConfig: defaultFunctionConfig,
});

/*
    TODO

    -Read access token from session store.
    -Make sure access token is sent with the API request.
    -Move access token logic to utils file that can be used elsewhere.
    -Retrieve permission from response
    -If the API response indicates edit permissions, show an edit group UI.
    -Make another API call for saving the data. If saving the data succeeds, show a success message. If saving the data fails,
    show an error message. This should happen if there is an endpoint error or there are insufficient permissions.
   */
