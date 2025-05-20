import {
  type AuthTokenResponsePassword,
  createClient,
  SupabaseClient,
} from "@supabase/supabase-js";
import { ExternalReducerAction } from "../../framework/update/api/ExternalReducerAction.js";
import type { DefaultApiAction } from "../../framework/update/api/DefaultApiAction.ts";
import { BaseDispatcher } from "../../framework/update/BaseDispatcher.ts";
import { LOGIN_COMPONENT_STORE, SESSION_STORE } from "./Constants.ts";
import { BaseReducer } from "../../framework/update/BaseReducer.ts";
import type { AuthRequest } from "./types/AuthRequest.ts";
import { AuthResponse } from "./types/AuthResponse.ts";
import { ReadOnlyStore } from "../../framework/store/ReadOnlyStore.ts";

const supabaseClient: SupabaseClient = createClient(
  "https://karqyskuudnvfxohwkok.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcnF5c2t1dWRudmZ4b2h3a29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODQ5NjgsImV4cCI6MjA1NzU2MDk2OH0.TR-Pn6dknOTtqS9y-gxK_S1-nw6TX-sL3gRH2kXJY_I",
);

async function retrieveData(
  params: AuthRequest,
  backupResponse: DefaultApiAction,
): Promise<AuthResponse> {
  if (
    backupResponse.defaultFunctionPriority &&
    backupResponse.defaultFunction
  ) {
    return backupResponse.defaultFunction();
  }
  const authResponse: AuthTokenResponsePassword =
    await supabaseClient.auth.signInWithPassword({
      email: params.username,
      password: params.password,
    });

  if (!authResponse.error) {
    return new AuthResponse(true, authResponse.data);
  }
  if (backupResponse.defaultFunction) {
    return backupResponse.defaultFunction(authResponse);
  } else {
    throw Error("Authentication error");
  }
}

function getLoginComponentStoreFromResponse(response: AuthResponse) {
  return {
    isLoggedIn: response.isLoggedIn(),
    errorMessage: response.getErrorMessage(),
    email: response?.getData()?.user?.email,
  };
}

const defaultResponse = {
  defaultFunction: (authData: any) => {
    console.error("Authentication error");
    return new AuthResponse(false, authData.data, authData.error.message);
  },
  defaultFunctionPriority: false,
};

export const authenticate: ExternalReducerAction = new ExternalReducerAction(
  retrieveData,
  defaultResponse,
);

export const updateLogin: BaseDispatcher = new BaseDispatcher(
  LOGIN_COMPONENT_STORE,
  getLoginComponentStoreFromResponse,
);

/**
 * TODO
 *
 * -Add login status to session store.
 * -Store session information in HttpOnly cookie
 * @param response
 */
function getSessionStoreFromResponse(response: AuthResponse): ReadOnlyStore {
  const responseData = response.isLoggedIn() ? response.getData() : "";
  const data = {
    access_token: responseData?.session?.access_token,
    userId: responseData?.user?.id,
    email: responseData?.user?.email,
  };
  return new ReadOnlyStore(data);
}

export const updateSession: BaseDispatcher = new BaseDispatcher(
  SESSION_STORE,
  getSessionStoreFromResponse,
);

export const AUTH_API = new BaseReducer(authenticate, [
  updateLogin,
  updateSession,
]);
