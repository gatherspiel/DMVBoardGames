import { getLocalStorageDataIfPresent } from "../../framework/utils/localStorageUtils.ts";
import { AUTH_TOKEN_KEY } from "../../utils/params.ts";

export function getAccessTokenIfPresent() {
  const authData = getLocalStorageDataIfPresent(AUTH_TOKEN_KEY);
  if (authData) {
    return authData["access_token"];
  }
  return null;
}
