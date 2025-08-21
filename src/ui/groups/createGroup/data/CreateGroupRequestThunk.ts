import type { ApiRequestConfig } from "@bponnaluri/places-js";
import { getAccessTokenIfPresent } from "../../../auth/AuthUtils.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../../auth/Constants.ts";
import { ApiActionTypes } from "@bponnaluri/places-js";
import { API_ROOT } from "../../../../shared/Params.ts";
import { generateApiThunk } from "@bponnaluri/places-js";

function updateCreateGroupRequestThunk(requestParams: any): ApiRequestConfig {
  const requestBody = {
    name: requestParams.name,
    description: requestParams.description,
    url: requestParams.url,
  };

  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }

  return {
    body: JSON.stringify(requestBody),
    headers: headers,
    method: ApiActionTypes.POST,
    url: API_ROOT + `/groups/`,
  };
}


export const CREATE_GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: updateCreateGroupRequestThunk,
});
