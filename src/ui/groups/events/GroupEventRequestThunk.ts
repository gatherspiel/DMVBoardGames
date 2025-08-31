import { API_ROOT } from "../../../shared/Params.js";
import { generateApiThunk } from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";
import {getUrlParameter} from "@bponnaluri/places-js";

function getEventRequestConfig(): ApiRequestConfig {
  return {
    url: API_ROOT + `/groups/events/${getUrlParameter("id")}/`,
  };
}

export const GROUP_EVENT_REQUEST_THUNK = generateApiThunk({
  queryConfig: getEventRequestConfig,
});
