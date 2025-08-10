import { setupGlobalState } from "../framework/state/data/GlobalStore.ts";
import {IS_LOGGED_IN_KEY} from "./Constants.ts";

let stateFields:Record<string, string> = {};

export function setupStateFields(){
  stateFields =  {
    LOGGED_IN:  IS_LOGGED_IN_KEY,
    GAME_LOCATIONS:"gameLocations",
  };
  setupGlobalState(stateFields);
}



