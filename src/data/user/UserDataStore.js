import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { API_ROOT } from "../../ui/shared/Params.js";

function getUserQueryConfig() {
  return {
    url: API_ROOT + "/user",
  };
}

export const USER_DATA_STORE = new DataStore(
  new ApiLoadAction(getUserQueryConfig),
);
