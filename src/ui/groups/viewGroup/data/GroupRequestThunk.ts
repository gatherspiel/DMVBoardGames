import { API_ROOT } from "../../../../shared/Params.js";
import { generateApiThunk } from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";

import {generatePreloadThunk} from "@bponnaluri/places-js";

function getGroupRequestConfig(requestParams: any): ApiRequestConfig {
  return {
    url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
  };
}

export const GROUP_REQUEST_THUNK = generateApiThunk({
  queryConfig: getGroupRequestConfig,
});

export const GROUP_PRELOAD_THUNK = generatePreloadThunk("preload_"+GROUP_REQUEST_THUNK.requestStoreId)

