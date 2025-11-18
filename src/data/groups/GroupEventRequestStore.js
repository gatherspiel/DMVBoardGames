import { API_ROOT } from "../../ui/shared/Params.js";
import {ApiLoadAction, DataStore} from "@bponnaluri/places-js";

function getEventRequestConfig() {
  return {
    url: API_ROOT + `/groups/events/${new URLSearchParams(document.location.search).get("id") ?? ""}/`,
  };
}

export const GROUP_EVENT_REQUEST_STORE = new DataStore(new ApiLoadAction(getEventRequestConfig));
