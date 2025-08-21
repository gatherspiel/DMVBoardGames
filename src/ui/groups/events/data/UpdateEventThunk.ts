import type { ApiRequestConfig } from "@bponnaluri/places-js";
import { API_ROOT } from "../../../../shared/Params.ts";
import { generateApiThunk } from "@bponnaluri/places-js";
import { ApiActionTypes } from "@bponnaluri/places-js";

function updateEventRequestThunk(
  requestParams: any,
): ApiRequestConfig {

  console.log("Updating event")
  return {
    body: JSON.stringify(requestParams),
    method: ApiActionTypes.PUT,
    url: API_ROOT + `/groups/${requestParams.groupId}/events/?id=${encodeURIComponent(requestParams.id)}`,
  };
}

export const UPDATE_EVENT_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateEventRequestThunk,
});
