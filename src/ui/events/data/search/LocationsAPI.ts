import { getGameRestaurants, getGameStores } from "../mock/MockPageData.ts";
import { API_ROOT, USE_MOCK } from "../../../../utils/params.ts";
import { getConventionData } from "../mock/MockConventionData.ts";
import { CONVENTION_LIST_STORE } from "../../components/ConventionListComponent.ts";
import { GAME_RESTAURANT_LIST_STORE } from "../../components/GameRestaurantComponent.ts";
import { GAME_STORE_LIST_STORE } from "../../components/GameStoreListComponent.ts";
import { generateGetApiReducer } from "../../../../framework/update/api/ApiReducerFactory.ts";

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

const defaultFunctionConfig = {
  defaultFunction: mockFunction,
  defaultFunctionPriority: USE_MOCK,
};

export const LOCATION_API = generateGetApiReducer({
  queryUrl: getLocationsQueryUrl,
  defaultFunctionConfig: defaultFunctionConfig,
  dispatcherItems: [
    {
      updateFunction: (data) => {
        return data.gameStores;
      },
      componentStore: GAME_STORE_LIST_STORE,
    },
    {
      updateFunction: (data) => {
        return data.gameRestaurants;
      },
      componentStore: GAME_RESTAURANT_LIST_STORE,
    },
    {
      updateFunction: (data) => {
        return data.conventions;
      },
      componentStore: CONVENTION_LIST_STORE,
    },
  ],
});
