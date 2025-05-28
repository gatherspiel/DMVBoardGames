import type { DefaultApiAction } from "../../../framework/store/update/api/DefaultApiAction.ts";
import type { BaseThunk } from "../../../framework/store/update/BaseThunk.ts";
import { generateApiReducerWithExternalClient } from "../../../framework/store/update/api/ApiThunkFactory.ts";
import type { LoginComponentStore } from "../types/LoginComponentStore.ts";
import { getSupabaseClient } from "../SupabaseClient.ts";
import { AuthResponse } from "../types/AuthResponse.ts";

async function retrieveData(params: any, backupResponse: DefaultApiAction) {
  console.log(params);
  console.log(backupResponse);

  const { error } = await getSupabaseClient().auth.signOut();

  if (!error) {
    return new AuthResponse(false);
  } else {
    return defaultResponse.defaultFunction(error.toString());
  }
}

const defaultResponse = {
  defaultFunction: (error: string) => {
    console.error("Failed to logout");
    return new AuthResponse(true, {}, error);
  },
  defaultFunctionPriority: false,
};

export function getLoginComponentStoreFromLogoutResponse(): LoginComponentStore {
  return {
    isLoggedIn: false,
  };
}

export const LOGOUT_REDUCER: BaseThunk = generateApiReducerWithExternalClient(
  retrieveData,
  defaultResponse,
);
