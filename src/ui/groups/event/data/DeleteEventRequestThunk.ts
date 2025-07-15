import type {ApiRequestConfig} from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import {ApiActionTypes} from "../../../../framework/state/update/api/types/ApiActionTypes.ts";
import {generateApiThunk} from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import {API_ROOT} from "../../../../shared/params.ts";


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
