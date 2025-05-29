import { API_ROOT } from "../../../utils/params.js";
import { generateApiThunk } from "../../../framework/store/update/api/ApiThunkFactory.ts";
import type { ApiRequestConfig } from "../../../framework/store/update/api/types/ApiRequestConfig.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../auth/Constants.ts";
import { getAccessTokenIfPresent } from "../../auth/AuthUtils.ts";

function getGroupsQueryUrl(requestParams: any): ApiRequestConfig {
  //TODO: Update to include headers

  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  console.log(authData);
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }
  console.log(headers);
  return {
    url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
    headers: headers,
  };
}

const defaultFunctionConfig = {
  defaultFunction: function () {
    return {};
  },
  defaultFunctionPriority: false,
};
export const GROUP_REQUEST_REDUCER = generateApiThunk({
  queryConfig: getGroupsQueryUrl,
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
