import { getLocalStorageDataIfPresent } from "../../framework/utils/LocalStorageUtils.ts";
import { AUTH_TOKEN_KEY } from "../../shared/Params.ts";

export function getAccessTokenIfPresent() {
  const authData = getLocalStorageDataIfPresent(AUTH_TOKEN_KEY);
  return authData ? authData["access_token"] : null;
}
