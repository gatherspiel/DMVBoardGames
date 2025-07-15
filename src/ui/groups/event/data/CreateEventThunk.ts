import type {ApiRequestConfig} from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import {getAccessTokenIfPresent} from "../../../auth/AuthUtils.ts";
import {AUTH_TOKEN_HEADER_KEY} from "../../../auth/Constants.ts";
import {ApiActionTypes} from "../../../../framework/state/update/api/types/ApiActionTypes.ts";
import {API_ROOT} from "../../../../shared/params.ts";
import {generateApiThunk} from "../../../../framework/state/update/api/ApiThunkFactory.ts";

function createEventThunk(
  requestParams: any,
): ApiRequestConfig {
  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }

  return {
    body: JSON.stringify(requestParams),
    method: ApiActionTypes.POST,
    headers: headers,
    url: API_ROOT + `/groups/${requestParams.groupId}/events/`,
  };
}

export const CREATE_EVENT_THUNK = generateApiThunk({
  queryConfig: createEventThunk,
});
