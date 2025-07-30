import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import { API_ROOT } from "../../../../shared/Params.ts";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import { ApiActionTypes } from "../../../../framework/state/update/api/types/ApiActionTypes.ts";
import type { UpdateGroupRequest } from "./types/UpdateGroupRequest.ts";

function updateGroupRequestThunk(
  requestParams: UpdateGroupRequest,
): ApiRequestConfig {

  console.log("Updating")
  return {
    body: JSON.stringify(requestParams),
    method: ApiActionTypes.PUT,
    url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
  };
}

const defaultFunctionConfig = {
  defaultFunction: function () {
    return {};
  },
};

export const UPDATE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateGroupRequestThunk,
  defaultFunctionConfig: defaultFunctionConfig,
});
