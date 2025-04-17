import {
  getGameRestaurants,
  getGameStores,
  getGroups,
} from "../mock/MockPageData.js";
import { getConventionData } from "../mock/MockConventionData.js";

export const DEFAULT_SEARCH_PARAMETER = "any";

export const CITY_PARAM = "city";
export const DAY_PARAM = "day";
export const MOCK_CITY_LIST = ["Arlington", "DC"];

function getCitiesQueryUrl() {
  return import.meta.env.VITE_API_ROOT + "/listCities";
}

function getLocationsQueryUrl() {
  return import.meta.env.VITE_API_ROOT + "/searchLocations";
}

function getEventsQueryUrl(searchParams) {
  let url = import.meta.env.VITE_API_ROOT + "/searchEvents";

  const paramMap = {};
  if (searchParams.day && searchParams.day !== DEFAULT_SEARCH_PARAMETER) {
    paramMap[DAY_PARAM] = searchParams.day;
  }

  if (
    searchParams.city &&
    searchParams.city !== DEFAULT_SEARCH_PARAMETER &&
    searchParams.city !== undefined
  ) {
    paramMap[CITY_PARAM] = searchParams.city;
  }

  if (paramMap && Object.keys(paramMap).length > 0) {
    let queryString = "?";

    let params = [];
    Object.keys(paramMap).forEach(function (param) {
      params.push(param + "=" + paramMap[param]);
    });
    queryString += params.join("&");
    url += queryString;
  }
  return url;
}

async function getData(queryUrl, mockFunction) {
  try {
    if (import.meta.env.VITE_USE_API_MOCK === "false") {
      const response = await fetch(queryUrl);
      if (response.status !== 200) {
        console.log("Did not retrieve data from API. Mock data will be used");
        return mockFunction();
      }

      const result = await response.json();
      return result;
    }
  } catch (e) {
    console.log(
      `Error when calling endpoint: ${queryUrl}. A mock will be used`,
    );
  }
  return mockFunction();
}

export async function getSearchResultGroups(searchParams) {
  const data = await getData(getEventsQueryUrl(searchParams), getGroups);
  return data.groupData;
}

export async function getSearchResultGameLocations() {
  const mockFunction = function () {
    return {
      conventions: getConventionData(),
      gameRestaurants: getGameRestaurants(),
      gameStores: getGameStores(),
    };
  };
  const data = await getData(getLocationsQueryUrl(), mockFunction);
  return data;
}

export async function getSearchCities() {
  const mockFunction = function () {
    return MOCK_CITY_LIST;
  };

  const data = await getData(getCitiesQueryUrl(), mockFunction);
  return data;
}
