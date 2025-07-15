import type {ApiRequestConfig} from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import {ApiActionTypes} from "../../../../framework/state/update/api/types/ApiActionTypes.ts";
import {API_ROOT} from "../../../../shared/params.ts";
import {generateApiThunk} from "../../../../framework/state/update/api/ApiThunkFactory.ts";

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
