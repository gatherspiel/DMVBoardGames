import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import { API_ROOT } from "../../../../shared/params.ts";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import { ApiActionTypes } from "../../../../framework/state/update/api/types/ApiActionTypes.ts";
import {SAVE_EVENT_REQUEST_STORE} from "../../Constants.ts";
import { getAccessTokenIfPresent } from "../../../auth/AuthUtils.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../../auth/Constants.ts";

function updateEventRequestThunk(
  requestParams: any,
): ApiRequestConfig {
  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }

  return {
    body: JSON.stringify(requestParams),
    method: ApiActionTypes.PUT,
    headers: headers,
    url: API_ROOT + `/groups/${requestParams.groupId}/events/?id=${encodeURIComponent(requestParams.id)}`,
  };
}




export const UPDATE_EVENT_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateEventRequestThunk,
  requestStoreName: SAVE_EVENT_REQUEST_STORE,
});
