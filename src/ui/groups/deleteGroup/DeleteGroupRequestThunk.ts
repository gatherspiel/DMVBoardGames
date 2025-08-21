import type { ApiRequestConfig } from "@bponnaluri/places-js";
import { ApiActionTypes } from "@bponnaluri/places-js";
import { API_ROOT } from "../../../shared/Params.ts";
import { generateApiThunk } from "@bponnaluri/places-js";

function updateDeleteGroupRequestThunk(params: any): ApiRequestConfig {
  const url = `${API_ROOT}/groups/?name=${encodeURIComponent(params.name)}&id=${params.id}`;
  return {
    method: ApiActionTypes.DELETE,
    url: url,
  };
}

export const DELETE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateDeleteGroupRequestThunk,
});
