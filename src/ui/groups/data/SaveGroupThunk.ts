import type { ApiRequestConfig } from "../../../framework/store/update/api/types/ApiRequestConfig.ts";
import { API_ROOT } from "../../../utils/params.ts";
import { generateApiThunk } from "../../../framework/store/update/api/ApiThunkFactory.ts";
import { ApiActionTypes } from "../../../framework/store/update/api/types/ApiActionTypes.ts";
import { SAVE_GROUP_REQUEST_STORE } from "../Constants.ts";
import { getAccessTokenIfPresent } from "../../auth/AuthUtils.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../auth/Constants.ts";

function saveGroupsRequestConfig(requestParams: any): ApiRequestConfig {
  console.log(requestParams);
  //TODO: Add group data.

  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }

  return {
    method: ApiActionTypes.PUT,
    url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
  };
}

const defaultFunctionConfig = {
  defaultFunction: function () {
    return {};
  },
  defaultFunctionPriority: false,
};

export const SAVE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: saveGroupsRequestConfig,
  defaultFunctionConfig: defaultFunctionConfig,
  requestStoreName: SAVE_GROUP_REQUEST_STORE,
});
