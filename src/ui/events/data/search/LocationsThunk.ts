import { getGameRestaurants, getGameStores } from "../mock/MockPageData.ts";
import { API_ROOT, USE_MOCK } from "../../../../utils/params.ts";
import { getConventionData } from "../mock/MockConventionData.ts";
import { generateApiThunk } from "../../../../framework/store/update/api/ApiThunkFactory.ts";

function getLocationsQueryConfig() {
  return {
    url: API_ROOT + "/searchLocations?area=dmv",
  };
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

export const LOCATIONS_THUNK = generateApiThunk({
  queryConfig: getLocationsQueryConfig,
  defaultFunctionConfig: defaultFunctionConfig,
});
