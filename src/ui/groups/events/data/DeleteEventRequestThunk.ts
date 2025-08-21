import type {ApiRequestConfig} from "@bponnaluri/places-js";
import {ApiActionTypes} from "@bponnaluri/places-js";
import {generateApiThunk} from "@bponnaluri/places-js";
import {API_ROOT} from "../../../../shared/Params.ts";


function updateDeleteEventRequestThunk(params: any): ApiRequestConfig {
  const url = `${API_ROOT}/groups/${params.groupId}/events/${encodeURIComponent(params.id)}/`
  return {
    method: ApiActionTypes.DELETE,
    url: url,
  };
}

export const DELETE_EVENT_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateDeleteEventRequestThunk,
});
