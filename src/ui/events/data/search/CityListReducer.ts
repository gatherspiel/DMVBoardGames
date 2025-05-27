import { API_ROOT, USE_MOCK } from "../../../../utils/params.ts";

import { DEFAULT_SEARCH_PARAMETER } from "../../components/event-search/Constants.ts";
import { generateGetApiReducer } from "../../../../framework/store/update/api/ApiThunkFactory.ts";

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

export const updateCities = function (cities: Record<number, string>): any {
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

export const CITY_LIST_REDUCER = generateGetApiReducer({
  queryUrl: getCitiesQueryUrl,
  defaultFunctionConfig: defaultFunctionConfig,
});
