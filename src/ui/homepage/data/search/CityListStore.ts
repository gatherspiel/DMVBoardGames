import { API_ROOT } from "../../../../shared/Params.ts";

import { DEFAULT_SEARCH_PARAMETER } from "../../components/group-search/Constants.ts";
import {ApiLoadAction, type ApiRequestConfig, DataStore} from "@bponnaluri/places-js";

function getCitiesQueryConfig(): ApiRequestConfig {
  return {
    url: API_ROOT + "/listCities?area=dmv",
  };
}


export const updateCities =  (cityArray:any) => {

  cityArray.sort();
  cityArray.unshift(DEFAULT_SEARCH_PARAMETER);

  let id = 0;
  let cityData: any[] = [];
  cityArray.map((location:any) => {
    cityData.push({
      id: id,
      name: location,
    });
    id++;
  });

  return cityData

};

export const CITY_LIST_STORE = new DataStore(new ApiLoadAction(getCitiesQueryConfig))