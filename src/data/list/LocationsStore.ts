import { API_ROOT } from "../../shared/Params.ts";
import {ApiLoadAction, DataStore} from "@bponnaluri/places-js";


export const CONVENTIONS_STORE = new DataStore(
  new ApiLoadAction(() => {
    return {
      url: API_ROOT + "/searchLocations?area=dmv&locationType=conventions",
    };
  }
));

export const GAME_RESTAURANT_STORE = new DataStore(
  new ApiLoadAction(() => {
      return {
        url: API_ROOT + "/searchLocations?area=dmv&locationType=gameRestaurants",
      };
    }));

export const GAME_STORE_DATA = new DataStore(
  new ApiLoadAction(() => {
    return {
      url: API_ROOT + "/searchLocations?area=dmv&locationType=gameStores",
    };
  }));