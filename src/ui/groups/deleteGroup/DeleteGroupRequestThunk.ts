import type { ApiRequestConfig } from "../../../framework/state/update/api/types/ApiRequestConfig.ts";
import { getAccessTokenIfPresent } from "../../auth/AuthUtils.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../auth/Constants.ts";
import { ApiActionTypes } from "../../../framework/state/update/api/types/ApiActionTypes.ts";
import { API_ROOT } from "../../../shared/params.ts";
import { generateApiThunk } from "../../../framework/state/update/api/ApiThunkFactory.ts";
import { DELETE_GROUP_REQUEST_STORE } from "../Constants.ts";

function updateDeleteGroupRequestThunk(params: any): ApiRequestConfig {
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

export const DELETE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateDeleteGroupRequestThunk,
  requestStoreName: DELETE_GROUP_REQUEST_STORE,
});
