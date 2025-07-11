import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import { getAccessTokenIfPresent } from "../../../auth/AuthUtils.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../../auth/Constants.ts";
import { ApiActionTypes } from "../../../../framework/state/update/api/types/ApiActionTypes.ts";
import { API_ROOT } from "../../../../shared/params.ts";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import { CREATE_GROUP_REQUEST_STORE } from "../../Constants.ts";

function updateCreateGroupRequestThunk(requestParams: any): ApiRequestConfig {
  const requestBody = {
    name: requestParams.name,
    description: requestParams.description,
    url: requestParams.url,
  };

  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }

  return {
    body: JSON.stringify(requestBody),
    headers: headers,
    method: ApiActionTypes.POST,
    url: API_ROOT + `/groups/`,
  };
}


export const CREATE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateCreateGroupRequestThunk,
  requestStoreName: CREATE_GROUP_REQUEST_STORE,
});
