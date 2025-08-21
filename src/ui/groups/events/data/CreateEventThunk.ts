import type {ApiRequestConfig} from "@bponnaluri/places-js";
import {ApiActionTypes} from "@bponnaluri/places-js";
import {API_ROOT} from "../../../../shared/Params.ts";
import {generateApiThunk} from "@bponnaluri/places-js";

function createEventThunk(
  requestParams: any,
): ApiRequestConfig {
  return {
    body: JSON.stringify(requestParams),
    method: ApiActionTypes.POST,
    url: API_ROOT + `/groups/${requestParams.groupId}/events/`,
  };
}

export const CREATE_EVENT_THUNK = generateApiThunk({
  queryConfig: createEventThunk,
});
