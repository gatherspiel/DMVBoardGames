import { API_ROOT } from "../../../../shared/Params.ts";
import {generateDataStore} from "@bponnaluri/places-js";

function getLocationsQueryConfig() {
  return {
    url: API_ROOT + "/searchLocations?area=dmv",
  };
}


export const LOCATIONS_STORE = generateDataStore({
  queryConfig: getLocationsQueryConfig,
})
