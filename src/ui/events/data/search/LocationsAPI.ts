import { BaseGet } from "../../../../framework/api/BaseGet.ts";
import { getGameRestaurants, getGameStores } from "../mock/MockPageData";
import { API_ROOT, USE_MOCK } from "../../../../utils/params";
import { BaseStateUpdate } from "../../../../framework/api/BaseStateUpdate.ts";
import { BaseAPI } from "../../../../framework/api/BaseAPI.ts";
import { getConventionData } from "../mock/MockConventionData";
import { CONVENTION_LIST_STATE } from "../../components/ConventionListComponent";
import { GAME_RESTAURANT_STATE } from "../../components/GameRestaurantComponent";
import { GAME_STORE_LIST_STATE } from "../../components/GameStoreListComponent";

function getLocationsQueryUrl() {
  return API_ROOT + "/searchLocations?area=dmv";
}

const mockFunction = function () {
  return {
    conventions: getConventionData(),
    gameRestaurants: getGameRestaurants(),
    gameStores: getGameStores(),
  };
};

const getData: BaseGet = new BaseGet(getLocationsQueryUrl, {
  defaultFunction: mockFunction,
  defaultFunctionPriority: USE_MOCK,
});

const updateConventions: BaseStateUpdate = new BaseStateUpdate(
  CONVENTION_LIST_STATE,
  (data) => {
    return data.conventions;
  },
);

const updateRestaurants: BaseStateUpdate = new BaseStateUpdate(
  GAME_RESTAURANT_STATE,
  (data) => {
    return data.gameRestaurants;
  },
);

const updateGameStores: BaseStateUpdate = new BaseStateUpdate(
  GAME_STORE_LIST_STATE,
  (data) => {
    return data.gameStores;
  },
);

const stateUpdates = [updateConventions, updateRestaurants, updateGameStores];

export const LOCATION_API = new BaseAPI(getData, stateUpdates);
