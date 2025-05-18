import {
  type AuthTokenResponsePassword,
  createClient,
  SupabaseClient,
} from "@supabase/supabase-js";
import { ExternalRequest } from "../../framework/update/api/ExternalRequest.js";
import type { DefaultResponse } from "../../framework/update/api/DefaultResponse.ts";
import { BaseStateUpdate } from "../../framework/update/BaseStateUpdate.ts";
import { LOGIN_COMPONENT_STATE, SESSION_STATE } from "./Constants.ts";
import { BaseUpdater } from "../../framework/update/BaseUpdater.ts";
import type { AuthRequest } from "./types/AuthRequest.ts";
import { AuthResponse } from "./types/AuthResponse.ts";
import { ReadOnlyState } from "../../framework/state/ReadOnlyState.ts";

const supabaseClient: SupabaseClient = createClient(
  "https://karqyskuudnvfxohwkok.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthcnF5c2t1dWRudmZ4b2h3a29rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5ODQ5NjgsImV4cCI6MjA1NzU2MDk2OH0.TR-Pn6dknOTtqS9y-gxK_S1-nw6TX-sL3gRH2kXJY_I",
);

async function retrieveData(
  params: AuthRequest,
  backupResponse: DefaultResponse,
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

function getLoginComponentStateFromResponse(response: AuthResponse) {
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

export const authenticate: ExternalRequest = new ExternalRequest(
  retrieveData,
  defaultResponse,
);

export const updateLogin: BaseStateUpdate = new BaseStateUpdate(
  LOGIN_COMPONENT_STATE,
  getLoginComponentStateFromResponse,
);

/**
 * TODO
 *
 * -Add login status to session state.
 * -Store session information in HttpOnly cookie
 * @param response
 */
function getSessionStateFromResponse(response: AuthResponse): ReadOnlyState {
  const responseData = response.isLoggedIn() ? response.getData() : "";
  const data = {
    access_token: responseData?.session?.access_token,
    userId: responseData?.user?.id,
    email: responseData?.user?.email,
  };
  return new ReadOnlyState(data);
}

export const updateSession: BaseStateUpdate = new BaseStateUpdate(
  SESSION_STATE,
  getSessionStateFromResponse,
);

export const AUTH_API = new BaseUpdater(authenticate, [
  updateLogin,
  updateSession,
]);
