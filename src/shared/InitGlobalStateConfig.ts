import { setupGlobalState } from "../framework/state/data/GlobalStore.ts";

export const stateFields: Record<string, string> = {
  LOGGED_IN: "isLoggedIn",
};

setupGlobalState(stateFields);

