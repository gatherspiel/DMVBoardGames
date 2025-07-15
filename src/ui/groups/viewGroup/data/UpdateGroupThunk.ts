import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import { API_ROOT } from "../../../../shared/params.ts";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import { ApiActionTypes } from "../../../../framework/state/update/api/types/ApiActionTypes.ts";
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
  defaultFunction: function () {
    return {};
  },
  defaultFunctionPriority: false,
};

export const UPDATE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateGroupRequestThunk,
  defaultFunctionConfig: defaultFunctionConfig,
});
