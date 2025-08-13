import { setupGlobalState } from "../framework/state/data/GlobalStore.ts";
import {IS_LOGGED_IN_KEY} from "./Constants.ts";

let stateFields:Record<string, string> = {};

export const SEARCH_RESULTS = "searchResults";
export const GROUP_DATA = "groupData";
export const GROUP_EVENT = "groupEvent";
export const CITY_LIST = "cityList";
export function setupStateFields(){
  stateFields =  {
    LOGGED_IN:  IS_LOGGED_IN_KEY,
    GAME_LOCATIONS:"gameLocations",
    SEARCH_RESULTS: "searchResults",
    CITY_LIST: CITY_LIST,
    GROUP_DATA: GROUP_DATA,
    GROUP_EVENT: GROUP_EVENT
  };
  setupGlobalState(stateFields);
}



