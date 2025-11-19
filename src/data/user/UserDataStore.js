import { ApiLoadAction, DataStore } from "@bponnaluri/places-js";
import { API_ROOT } from "../../ui/shared/Params.js";

function getUserQueryConfig() {
  return {
    url: API_ROOT + "/user",
  };
}

export const USER_DATA_STORE = new DataStore(
  new ApiLoadAction(getUserQueryConfig),
);
