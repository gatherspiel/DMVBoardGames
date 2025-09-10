import { API_ROOT } from "../../../../shared/Params.ts";
import {ApiLoadAction, DataStore} from "@bponnaluri/places-js";

function getLocationsQueryConfig() {
  return {
    url: API_ROOT + "/searchLocations?area=dmv",
  };
}

export const LOCATIONS_STORE = new DataStore(new ApiLoadAction(getLocationsQueryConfig));
