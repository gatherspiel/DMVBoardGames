import {
  getGameRestaurants,
  getGameStores,
  getGroups,
} from "../mock/MockPageData.js";
import { getConventionData } from "../mock/MockConventionData.js";
import { DEFAULT_SEARCH_PARAMETER } from "../../components/event-search/Constants.js";

import { updateState } from "../../../../framework/state/StateManager.js";
import {
  GROUP_STATE_NAME,
  updateSearchResultState,
} from "../state/GroupState.js";
import { CONVENTION_LIST_STATE } from "../../components/ConventionListComponent.js";
import { SEARCH_COMPONENT_STATE } from "../../components/event-search/Constants.js";
import { updateCities } from "../../components/event-search/EventSearchState.js";
import { GAME_RESTAURANT_STATE } from "../../components/GameRestaurantComponent.js";
import { GAME_STORE_LIST_STATE } from "../../components/GameStoreListComponent.js";

export const SEARCH_REQUEST_STATE = "searchRequestState";
export const CITY_PARAM = "city";
export const DAY_PARAM = "day";
export const MOCK_CITY_LIST = ["Arlington", "DC"];

export class EventSearchAPI {
  getEventsQueryUrl(searchParams) {
    let url = import.meta.env.VITE_API_ROOT + "searchEvents";
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
        params.push(param + "=" + paramMap[param].replace(" ", "%20"));
      });
      queryString += params.join("&");
      url += queryString;
    }
    return url;
  }

  async updateData(searchParams) {
    const groupResults = await getData(
      this.getEventsQueryUrl(searchParams),
      getGroups,
    );

    updateState(
      GROUP_STATE_NAME,
      updateSearchResultState,
      groupResults.groupData,
    );
  }
}

function getCitiesQueryUrl() {
  return import.meta.env.VITE_API_ROOT + "listCities";
}

function getLocationsQueryUrl() {
  return import.meta.env.VITE_API_ROOT + "searchLocations";
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

export function getSearchResultGameLocations() {
  const mockFunction = function () {
    return {
      conventions: getConventionData(),
      gameRestaurants: getGameRestaurants(),
      gameStores: getGameStores(),
    };
  };

  getData(getLocationsQueryUrl(), mockFunction).then((data) => {
    updateState(CONVENTION_LIST_STATE, function () {
      return data.conventions;
    });
    updateState(GAME_RESTAURANT_STATE, function () {
      return data.gameRestaurants;
    });
    updateState(GAME_STORE_LIST_STATE, function () {
      return data.gameStores;
    });
  });
}

export function getSearchCities() {
  const mockFunction = function () {
    return MOCK_CITY_LIST;
  };

  getData(getCitiesQueryUrl(), mockFunction).then(function (data) {
    updateState(SEARCH_COMPONENT_STATE, updateCities, data);
  });
}
