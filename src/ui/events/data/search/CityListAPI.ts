import { API_ROOT, USE_MOCK } from "../../../../utils/params.ts";

import {
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_COMPONENT_STORE,
} from "../../components/event-search/Constants.ts";
import { generateGetApiReducer } from "../../../../framework/update/api/ApiReducerFactory.ts";

const MOCK_CITY_LIST = ["Arlington", "DC"];

function getCitiesQueryUrl() {
  return API_ROOT + "/listCities?area=dmv";
}

const mockFunction = function () {
  return MOCK_CITY_LIST;
};

export const defaultFunctionConfig = {
  defaultFunction: mockFunction,
  defaultFunctionPriority: USE_MOCK,
};

const updateCities = function (cities: Record<number, string>): any {
  const cityArray = Object.values(cities);
  cityArray.sort();
  cityArray.unshift(DEFAULT_SEARCH_PARAMETER);

  let id = 0;
  let cityData: any[] = [];
  cityArray.map((location) => {
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

export const CITIES_API = generateGetApiReducer({
  queryUrl: getCitiesQueryUrl,
  defaultFunctionConfig: defaultFunctionConfig,
  dispatcherItems: [
    { updateFunction: updateCities, componentStore: SEARCH_COMPONENT_STORE },
  ],
});
