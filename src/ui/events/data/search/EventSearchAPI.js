import {
  getGameRestaurants,
  getGameStores,
  getGroups,
} from "../mock/MockPageData.js";

import { API_ROOT } from "../../../../utils/params.js";
import { getConventionData } from "../mock/MockConventionData.js";
import { DEFAULT_SEARCH_PARAMETER } from "../../components/event-search/Constants.js";

import { updateComponentState } from "../../../../framework/state/ComponentStateManager.js";
import {
  GROUP_STATE_NAME,
  updateSearchResultState,
} from "../state/SearchResultGroupState.js";
import { CONVENTION_LIST_STATE } from "../../components/ConventionListComponent.js";
import { SEARCH_COMPONENT_STATE } from "../../components/event-search/Constants.js";
import { updateCities } from "../../components/event-search/EventSearchState.js";
import { GAME_RESTAURANT_STATE } from "../../components/GameRestaurantComponent.js";
import { GAME_STORE_LIST_STATE } from "../../components/GameStoreListComponent.js";
import { getData } from "../mock/MockPageData.js";
import { getResponseData } from "../../../../framework/state/RequestStateManager.js";

export const SEARCH_REQUEST_STATE = "searchRequestState";
export const CITY_PARAM = "city";
export const DAY_PARAM = "day";
export const MOCK_CITY_LIST = ["Arlington", "DC"];

export class EventSearchAPI {
  getEventsQueryUrl(searchParams) {
    let url = API_ROOT + "/searchEvents";
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

  async retrieveData(searchParams) {
    return await getResponseData(
      this.getEventsQueryUrl(searchParams),
      getGroups,
      import.meta.env.VITE_USE_API_MOCK,
    );
  }

  async updateData(response) {
    updateComponentState(
      GROUP_STATE_NAME,
      updateSearchResultState,
      response.groupData,
    );
  }
}

function getCitiesQueryUrl() {
  return API_ROOT + "/listCities?area=dmv";
}

function getLocationsQueryUrl() {
  return API_ROOT + "/searchLocations?area=dmv";
}

export function getSearchResultGameLocations() {
  const mockFunction = function () {
    return {
      conventions: getConventionData(),
      gameRestaurants: getGameRestaurants(),
      gameStores: getGameStores(),
    };
  };

  getResponseData(
    getLocationsQueryUrl(),
    mockFunction,
    import.meta.env.VITE_USE_API_MOCK,
  ).then((data) => {
    updateComponentState(CONVENTION_LIST_STATE, function () {
      return data.conventions;
    });
    updateComponentState(GAME_RESTAURANT_STATE, function () {
      return data.gameRestaurants;
    });
    updateComponentState(GAME_STORE_LIST_STATE, function () {
      return data.gameStores;
    });
  });
}

export function getSearchCities() {
  const mockFunction = function () {
    return MOCK_CITY_LIST;
  };

  getResponseData(
    getCitiesQueryUrl(),
    mockFunction,
    import.meta.env.VITE_USE_API_MOCK,
  ).then(function (data) {
    updateComponentState(SEARCH_COMPONENT_STATE, updateCities, data);
  });
}
