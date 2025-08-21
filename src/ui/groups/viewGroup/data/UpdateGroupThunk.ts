import type { ApiRequestConfig } from "@bponnaluri/places-js";
import { API_ROOT } from "../../../../shared/Params.ts";
import { generateApiThunk } from "@bponnaluri/places-js";
import { ApiActionTypes } from "@bponnaluri/places-js";
import type { UpdateGroupRequest } from "./types/UpdateGroupRequest.ts";

function updateGroupRequestThunk(
  requestParams: UpdateGroupRequest,
): ApiRequestConfig {

  return {
    body: JSON.stringify(requestParams),
    method: ApiActionTypes.PUT,
    url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
  };
}

const defaultFunctionConfig = {
  defaultFunction:  () => {
    return {};
  },
};

export const UPDATE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateGroupRequestThunk,
  defaultFunctionConfig: defaultFunctionConfig,
});
