import { API_ROOT } from "../../../../utils/params.js";
import { generateApiThunk } from "../../../../framework/store/update/api/ApiThunkFactory.ts";
import type { ApiRequestConfig } from "../../../../framework/store/update/api/types/ApiRequestConfig.ts";
import { AUTH_TOKEN_HEADER_KEY } from "../../../auth/Constants.ts";
import { getAccessTokenIfPresent } from "../../../auth/AuthUtils.ts";
import {getUrlParameter} from "../../../../framework/utils/UrlParamUtils.ts";

function getEventRequestConfig(): ApiRequestConfig {
  let headers: Record<string, string> = {};
  const authData = getAccessTokenIfPresent();
  if (authData) {
    headers[AUTH_TOKEN_HEADER_KEY] = authData;
  }
  return {
    url: API_ROOT + `/groups/events/${getUrlParameter("id")}/`,

    headers: headers,
  };
}

const defaultFunctionConfig = {
  defaultFunction: function () {
    return {};
  },
  defaultFunctionPriority: false,
};
export const EVENT_REQUEST_THUNK = generateApiThunk({
  queryConfig: getEventRequestConfig,
  defaultFunctionConfig: defaultFunctionConfig,
});
