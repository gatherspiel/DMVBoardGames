import { BaseGetAction } from "../../../../framework/update/api/BaseGetAction.ts";
import { getGameRestaurants, getGameStores } from "../mock/MockPageData.ts";
import { API_ROOT, USE_MOCK } from "../../../../utils/params.ts";
import { BaseDispatcher } from "../../../../framework/update/BaseDispatcher.ts";
import { BaseReducer } from "../../../../framework/update/BaseReducer.ts";
import { getConventionData } from "../mock/MockConventionData.ts";
import { CONVENTION_LIST_STATE } from "../../components/ConventionListComponent.ts";
import { GAME_RESTAURANT_STATE } from "../../components/GameRestaurantComponent.ts";
import { GAME_STORE_LIST_STATE } from "../../components/GameStoreListComponent.ts";

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

const getData: BaseGetAction = new BaseGetAction(getLocationsQueryUrl, {
  defaultFunction: mockFunction,
  defaultFunctionPriority: USE_MOCK,
});

const updateConventions: BaseDispatcher = new BaseDispatcher(
  CONVENTION_LIST_STATE,
  (data) => {
    return data.conventions;
  },
);

const updateRestaurants: BaseDispatcher = new BaseDispatcher(
  GAME_RESTAURANT_STATE,
  (data) => {
    return data.gameRestaurants;
  },
);

const updateGameStores: BaseDispatcher = new BaseDispatcher(
  GAME_STORE_LIST_STATE,
  (data) => {
    return data.gameStores;
  },
);

const stateUpdates = [updateConventions, updateRestaurants, updateGameStores];

export const LOCATION_API = new BaseReducer(getData, stateUpdates);
