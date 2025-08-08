import { API_ROOT } from "../../../../shared/Params.ts";
import { generateApiThunk } from "../../../../framework/state/update/api/ApiThunkFactory.ts";

function getLocationsQueryConfig() {
  return {
    url: API_ROOT + "/searchLocations?area=dmv",
  };
}


export const LOCATIONS_THUNK = generateApiThunk({
  queryConfig: getLocationsQueryConfig,
}).addGlobalStateReducer((data:any)=>{
  return {
    "gameLocations": data
  };
})
