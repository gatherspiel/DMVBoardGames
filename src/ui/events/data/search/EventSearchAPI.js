import { getGameRestaurants, getGameStores } from "../mock/MockPageData.js";

import { API_ROOT, USE_MOCK } from "../../../../utils/params.js";
import { getConventionData } from "../mock/MockConventionData.js";

import { updateComponentState } from "../../../../framework/state/ComponentStateManager.ts";

import { CONVENTION_LIST_STATE } from "../../components/ConventionListComponent.js";
import { SEARCH_COMPONENT_STATE } from "../../components/event-search/Constants.ts";
import { updateCities } from "../../components/event-search/EventSearchState.js";
import { GAME_RESTAURANT_STATE } from "../../components/GameRestaurantComponent.js";
import { GAME_STORE_LIST_STATE } from "../../components/GameStoreListComponent.js";
import { getResponseData } from "../../../../framework/state/RequestStateManager.ts";

export const SEARCH_REQUEST_STATE = "searchRequestState";
export const CITY_PARAM = "city";
export const DAY_PARAM = "day";
export const MOCK_CITY_LIST = ["Arlington", "DC"];

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

  getResponseData(getLocationsQueryUrl(), {
    defaultFunction: mockFunction,
    defaultFunctionPriority: import.meta.env.VITE_USE_API_MOCK,
  }).then((data) => {
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

  getResponseData(getCitiesQueryUrl(), {
    defaultFunction: mockFunction,
    defaultFunctionPriority: USE_MOCK,
  }).then(function (data) {
    updateComponentState(SEARCH_COMPONENT_STATE, updateCities, data);
  });
}
