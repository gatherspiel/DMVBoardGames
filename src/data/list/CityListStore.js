import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { API_ROOT } from "../../ui/shared/Params.js";

function getCitiesQueryConfig() {
  return {
    url: API_ROOT + "/listCities?area=dmv",
  };
}

export const CITY_LIST_STORE = new DataStore(
  new ApiLoadAction(getCitiesQueryConfig),
);
