import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import { API_ROOT } from "../../../../shared/params.ts";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import { ApiActionTypes } from "../../../../framework/state/update/api/types/ApiActionTypes.ts";

function updateEventRequestThunk(
  requestParams: any,
): ApiRequestConfig {

  return {
    body: JSON.stringify(requestParams),
    method: ApiActionTypes.PUT,
    url: API_ROOT + `/groups/${requestParams.groupId}/events/?id=${encodeURIComponent(requestParams.id)}`,
  };
}

export const UPDATE_EVENT_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateEventRequestThunk,
});
