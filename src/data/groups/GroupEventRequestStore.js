import { ApiLoadAction, DataStore } from "@bponnaluri/places-js";
import { API_ROOT } from "../../ui/shared/Params.js";

function getEventRequestConfig() {
  return {
    url:
      API_ROOT +
      `/groups/events/${new URLSearchParams(document.location.search).get("id") ?? ""}/`,
  };
}

export const GROUP_EVENT_REQUEST_STORE = new DataStore(
  new ApiLoadAction(getEventRequestConfig),
);
