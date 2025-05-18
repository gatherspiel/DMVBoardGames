import { getDataFromState } from "../../framework/state/ComponentStateManager.ts";
import { SESSION_STATE } from "./Constants.ts";

export function getAccessToken() {
  return getDataFromState(SESSION_STATE, "access_token");
}
