import { API_ROOT, USE_MOCK } from "../../../../shared/Params.ts";

import { DEFAULT_SEARCH_PARAMETER } from "../../components/event-search/Constants.ts";
import { generateApiThunk } from "@bponnaluri/places-js";
import type { ApiRequestConfig } from "@bponnaluri/places-js";

const MOCK_CITY_LIST = ["Arlington", "DC"];

function getCitiesQueryConfig(): ApiRequestConfig {
  return {
    url: API_ROOT + "/listCities?area=dmv",
  };
}

const mockFunction =  () => MOCK_CITY_LIST;


export const defaultFunctionConfig = {
  defaultFunction: mockFunction,
  defaultFunctionPriority: USE_MOCK,
};

export const updateCities =  (data:any) => {

  const cityArray = data.cityList

  if(!cityArray || cityArray.length === 0 || !cityArray.sort){
    return {};
  }

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

  return {
    cities: cityData,
  };
};

export const CITY_LIST_THUNK = generateApiThunk({
  queryConfig: getCitiesQueryConfig,
  defaultFunctionConfig: defaultFunctionConfig,
}).addGlobalStateReducer((data:any)=> {
  return {cityList: data}
});
