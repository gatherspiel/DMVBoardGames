import { API_ROOT } from "../../../../shared/params.js";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";
import type { ApiRequestConfig } from "../../../../framework/state/update/api/types/ApiRequestConfig.ts";
import {generatePreloadThunk} from "../../../../framework/state/update/PreloadThunk.ts";

function getGroupRequestConfig(requestParams: any): ApiRequestConfig {
  return {
    url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
  };
}

export const GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: getGroupRequestConfig,
});

export const GROUP_PRELOAD_THUNK = generatePreloadThunk("preload_"+GROUP_REQUEST_THUNK.requestStoreId)

