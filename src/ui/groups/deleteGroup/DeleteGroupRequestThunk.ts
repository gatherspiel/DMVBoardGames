import type { ApiRequestConfig } from "../../../framework/state/update/api/types/ApiRequestConfig.ts";
import { ApiActionTypes } from "../../../framework/state/update/api/types/ApiActionTypes.ts";
import { API_ROOT } from "../../../shared/Params.ts";
import { generateApiThunk } from "../../../framework/state/update/api/ApiThunkFactory.ts";

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
