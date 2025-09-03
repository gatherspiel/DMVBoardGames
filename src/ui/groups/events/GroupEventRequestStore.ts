import { API_ROOT } from "../../../shared/Params.js";
import {ApiLoadAction, type ApiRequestConfig, DataStore} from "@bponnaluri/places-js";

function getEventRequestConfig(): ApiRequestConfig {
  return {
    url: API_ROOT + `/groups/events/${new URLSearchParams(document.location.search).get("id") ?? ""}/`,
  };
}

export const GROUP_EVENT_REQUEST_STORE = new DataStore(new ApiLoadAction(getEventRequestConfig));
