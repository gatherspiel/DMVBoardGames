import { setupGlobalState } from "../framework/state/data/GlobalStore.ts";

let stateFields:Record<string, string> = {};

export function setupStateFields(){
  console.log("Setting up global state");
  stateFields =  {
    LOGGED_IN: "isLoggedIn",
  };
  setupGlobalState(stateFields);
}



