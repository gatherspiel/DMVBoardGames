import type { ApiRequestConfig } from "../../../framework/store/update/api/types/ApiRequestConfig.ts";
import { getAccessTokenIfPresent } from "../../auth/AuthUtils.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../auth/Constants.ts";
import { ApiActionTypes } from "../../../framework/store/update/api/types/ApiActionTypes.ts";
import { API_ROOT } from "../../../utils/params.ts";
import { generateApiThunk } from "../../../framework/store/update/api/ApiThunkFactory.ts";
import { DELETE_GROUP_REQUEST_STORE } from "../Constants.ts";

function updateDeleteGroupRequestThunk(params: any): ApiRequestConfig {
  console.log("Params for deleting group:" + params);
  const url = `${API_ROOT}/groups/?name=${encodeURIComponent(params.name)}&id=${params.id}`;

  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }

  return {
    headers: headers,
    method: ApiActionTypes.DELETE,
    url: url,
  };
}

const defaultFunctionConfig = {
  defaultFunction: function (response: any) {
    return {
      errorMessage: response.message,
    };
  },
  defaultFunctionPriority: false,
};

export const DELETE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateDeleteGroupRequestThunk,
  defaultFunctionConfig: defaultFunctionConfig,
  requestStoreName: DELETE_GROUP_REQUEST_STORE,
});
