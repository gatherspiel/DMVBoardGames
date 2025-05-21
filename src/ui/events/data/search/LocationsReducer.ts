import { getGameRestaurants, getGameStores } from "../mock/MockPageData.ts";
import { API_ROOT, USE_MOCK } from "../../../../utils/params.ts";
import { getConventionData } from "../mock/MockConventionData.ts";
import { generateGetApiReducer } from "../../../../framework/reducer/api/ApiReducerFactory.ts";

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

export const LOCATIONS_REDUCER = generateGetApiReducer({
  queryUrl: getLocationsQueryUrl,
  defaultFunctionConfig: defaultFunctionConfig,
});
