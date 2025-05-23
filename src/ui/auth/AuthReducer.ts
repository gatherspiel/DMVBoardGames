import {
  type AuthTokenResponsePassword,
  createClient,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { DefaultApiAction } from "../../framework/reducer/api/DefaultApiAction.ts";
import { BaseDispatcher } from "../../framework/reducer/BaseDispatcher.ts";
import { SESSION_STORE } from "./Constants.ts";
import { BaseReducer } from "../../framework/reducer/BaseReducer.ts";
import type { AuthRequest } from "./types/AuthRequest.ts";
import { AuthResponse } from "./types/AuthResponse.ts";
import { GlobalReadOnlyStore } from "../../framework/store/GlobalReadOnlyStore.ts";
import { generateApiReducerWithExternalClient } from "../../framework/reducer/api/ApiReducerFactory.ts";
import { getLocalStorageDataIfPresent } from "../../framework/utils/localStorageUtils.ts";
import { isAfterNow } from "../../framework/utils/dateUtils.ts";
import type { AuthReducerError } from "./types/AuthReducerError.ts";
import {
  SUPABASE_CLIENT_KEY,
  SUPABASE_CLIENT_URL,
} from "../../utils/params.ts";

const supabaseClient: SupabaseClient = createClient(
  SUPABASE_CLIENT_URL,
  SUPABASE_CLIENT_KEY,
);

async function retrieveData(
  params: AuthRequest,
  backupResponse: DefaultApiAction,
): Promise<AuthResponse> {
  try {
    if (
      backupResponse.defaultFunctionPriority &&
      backupResponse.defaultFunction
    ) {
      return backupResponse.defaultFunction();
    }

    const authData = await getLocalStorageDataIfPresent(
      "sb-karqyskuudnvfxohwkok-auth-token",
    );

    if (authData && isAfterNow(authData.expires_at)) {
      return new AuthResponse(true, authData);
    }

    if (!params.username || !params.password) {
      return backupResponse.defaultFunction({
        errorMessage: "Enter a valid username and password",
      });
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
  } catch (e: any) {
    console.trace();
    return backupResponse.defaultFunction({
      errorMessage: e.message,
    });
  }
}

export function getLoginComponentStoreFromResponse(response: AuthResponse) {
  console.log(JSON.stringify(response));

  return {
    isLoggedIn: response.isLoggedIn(),
    errorMessage: response.getErrorMessage(),
    email: response?.getData()?.user?.email,
  };
}

const defaultResponse = {
  defaultFunction: (authData: AuthResponse | AuthReducerError) => {
    if (authData instanceof AuthResponse) {
      console.error("Authentication error");
      return new AuthResponse(
        false,
        authData.getData(),
        authData.getErrorMessage().toString(),
      );
    } else {
      return new AuthResponse(false, {}, authData.errorMessage);
    }
  },
  defaultFunctionPriority: false,
};

export const AUTH_REDUCER: BaseReducer = generateApiReducerWithExternalClient(
  retrieveData,
  defaultResponse,
);

/**
 * TODO
 *
 * -Add login status to session store.
 * -Store session information in HttpOnly cookie
 * @param response
 */
export function getSessionStoreFromResponse(
  response: AuthResponse,
): GlobalReadOnlyStore {
  const responseData = response.isLoggedIn() ? response.getData() : "";
  const data = {
    userId: responseData?.user?.id,
    email: responseData?.user?.email,
  };
  return new GlobalReadOnlyStore(data);
}

export const updateSession: BaseDispatcher = new BaseDispatcher(
  SESSION_STORE,
  getSessionStoreFromResponse,
);
