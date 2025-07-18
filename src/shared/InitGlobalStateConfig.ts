import { setupGlobalState } from "../framework/state/data/GlobalStore.ts";

let stateFields:Record<string, string> = {};

export function setupStateFields(){
  stateFields =  {
    LOGGED_IN: "isLoggedIn",
  };
  setupGlobalState(stateFields);
}



