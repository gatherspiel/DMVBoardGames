import { API_ROOT } from "../../../../shared/params.js";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import {getUrlParameter} from "../../../../framework/utils/UrlParamUtils.ts";

function getEventRequestConfig(): ApiRequestConfig {
  return {
    url: API_ROOT + `/groups/events/${getUrlParameter("id")}/`,
  };
}

export const GROUP_EVENT_REQUEST_THUNK = generateApiThunk({
  queryConfig: getEventRequestConfig,
});
