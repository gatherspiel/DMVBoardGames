import { API_ROOT } from "../../../shared/Params.js";
import { generateDataStore } from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";

function getGroupRequestConfig(requestParams: any): ApiRequestConfig {
  console.log("Retrieving data");
  return {
    url: API_ROOT + `/groups/?name=${encodeURIComponent(requestParams.name)}`,
  };
}

export const GROUP_REQUEST_STORE = generateDataStore({
  queryConfig: getGroupRequestConfig,
});




