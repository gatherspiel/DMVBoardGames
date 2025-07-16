import { API_ROOT } from "../../../../shared/params.js";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";

function getGroupRequestConfig(requestParams: any): ApiRequestConfig {
  return {
    url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
  };
}

export const GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: getGroupRequestConfig,
});
