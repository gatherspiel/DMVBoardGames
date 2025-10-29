import { API_ROOT } from "../../shared/Params.ts";

import {ApiLoadAction, type ApiRequestConfig, DataStore} from "@bponnaluri/places-js";

function getCitiesQueryConfig(): ApiRequestConfig {
  return {
    url: API_ROOT + "/listCities?area=dmv",
  };
}

export const CITY_LIST_STORE = new DataStore(new ApiLoadAction(getCitiesQueryConfig))