import { BaseGetRequest } from "../../../../framework/update/api/BaseGetRequest.ts";
import { API_ROOT, USE_MOCK } from "../../../../utils/params.ts";
import { BaseStateUpdate } from "../../../../framework/update/BaseStateUpdate.ts";
import { BaseUpdater } from "../../../../framework/update/BaseUpdater.ts";

import {
  DEFAULT_SEARCH_PARAMETER,
  SEARCH_COMPONENT_STATE,
} from "../../components/event-search/Constants.ts";

const MOCK_CITY_LIST = ["Arlington", "DC"];

function getCitiesQueryUrl() {
  return API_ROOT + "/listCities?area=dmv";
}

const mockFunction = function () {
  return MOCK_CITY_LIST;
};

const getData: BaseGetRequest = new BaseGetRequest(getCitiesQueryUrl, {
  defaultFunction: mockFunction,
  defaultFunctionPriority: USE_MOCK,
});

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

const updateCityList: BaseStateUpdate = new BaseStateUpdate(
  SEARCH_COMPONENT_STATE,
  updateCities,
);

export const CITIES_API = new BaseUpdater(getData, [updateCityList]);
