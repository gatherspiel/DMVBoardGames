import { API_ROOT } from "../../../../shared/params.js";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../../auth/Constants.ts";
import { getAccessTokenIfPresent } from "../../../auth/AuthUtils.ts";

function getGroupRequestConfig(requestParams: any): ApiRequestConfig {
  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }
  return {
    url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
    headers: headers,
  };
}

export const GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: getGroupRequestConfig,
});
