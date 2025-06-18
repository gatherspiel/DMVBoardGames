import type { ApiRequestConfig } from "../../../../framework/store/update/api/types/ApiRequestConfig.ts";
import { getAccessTokenIfPresent } from "../../../auth/AuthUtils.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../../auth/Constants.ts";
import { ApiActionTypes } from "../../../../framework/store/update/api/types/ApiActionTypes.ts";
import { API_ROOT } from "../../../../utils/params.ts";
import { generateApiThunk } from "../../../../framework/store/update/api/ApiThunkFactory.ts";
import { CREATE_GROUP_REQUEST_STORE } from "../../Constants.ts";

function updateCreateGroupRequestThunk(requestParams: any): ApiRequestConfig {
  const requestBody = {
    name: requestParams.name,
    summary: requestParams.summary,
    url: requestParams.url,
  };

  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }

  return {
    body: JSON.stringify(requestBody),
    method: ApiActionTypes.POST,
    headers: headers,
    url: API_ROOT + `/groups/`,
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

export const CREATE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateCreateGroupRequestThunk,
  defaultFunctionConfig: defaultFunctionConfig,
  requestStoreName: CREATE_GROUP_REQUEST_STORE,
});
