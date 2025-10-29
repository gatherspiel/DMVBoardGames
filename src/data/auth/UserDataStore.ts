import {ApiLoadAction, type ApiRequestConfig, DataStore} from "@bponnaluri/places-js";
import {API_ROOT} from "../../shared/Params.ts";

function getUserQueryConfig(): ApiRequestConfig {

  return {
    url: API_ROOT + "/user",
  };
}

export const USER_DATA_STORE = new DataStore(new ApiLoadAction(getUserQueryConfig))