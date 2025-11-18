import { API_ROOT } from "../../ui/shared/Params.js";

import {ApiLoadAction, DataStore} from "@bponnaluri/places-js";

function getCitiesQueryConfig() {
  return {
    url: API_ROOT + "/listCities?area=dmv",
  };
}

export const CITY_LIST_STORE = new DataStore(new ApiLoadAction(getCitiesQueryConfig))