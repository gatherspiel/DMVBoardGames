import { getDataFromStore } from "../../framework/store/data/ComponentStore.ts";

import { SESSION_STORE } from "./Constants.ts";

export function getAccessToken() {
  return getDataFromStore(SESSION_STORE, "access_token");
}
