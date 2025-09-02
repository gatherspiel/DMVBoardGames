import { API_ROOT } from "../../../shared/Params.js";
import { generateDataStore } from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";

function getEventRequestConfig(): ApiRequestConfig {
  console.log("Loading")
  return {
    url: API_ROOT + `/groups/events/${new URLSearchParams(document.location.search).get("id") ?? ""}/`,
  };
}

export const GROUP_EVENT_REQUEST_STORE = generateDataStore({
  queryConfig: getEventRequestConfig,
});
