import type { DefaultApiAction } from "../../../framework/state/update/api/DefaultApiAction.ts";
import { BaseThunk } from "../../../framework/state/update/BaseThunk.ts";
import type { AuthRequest } from "../types/AuthRequest.ts";
import { AuthResponse } from "../types/AuthResponse.ts";
import { generateApiThunkWithExternalConfig } from "../../../framework/state/update/api/ApiThunkFactory.ts";
import {addLocalStorageData, getLocalStorageDataIfPresent} from "../../../framework/utils/LocalStorageUtils.ts";
import { isAfterNow } from "../../../framework/utils/EventDataUtils.ts";
import type { AuthReducerError } from "../types/AuthReducerError.ts";
import {AUTH_TOKEN_KEY, SUPABASE_CLIENT_KEY, SUPABASE_CLIENT_URL} from "../../../shared/Params.ts";
import {GROUP_DESCRIPTION_TEXT} from "../../groups/Constants.ts";
import {IS_LOGGED_IN_KEY} from "../../../shared/Constants.ts";

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

    const authData = await getLocalStorageDataIfPresent(AUTH_TOKEN_KEY);

    if (authData && isAfterNow(authData.expires_at)) {
      return new AuthResponse(true, authData);
    }

    if(!params.username && !params.password){
      return backupResponse.defaultFunction({});
    }


    const url = `${SUPABASE_CLIENT_URL}/auth/v1/token?grant_type=password`

    const headers = {
      apiKey: SUPABASE_CLIENT_KEY,
    }

    const body = {
      email:params.username,
      password: params.password
    }


    const data:Response = await fetch(
      url, {
        method: "POST",
        headers:headers,
        body:JSON.stringify(body)
      }
    )

    if (data.ok) {
      const authTokenData = await data.json();

      addLocalStorageData(AUTH_TOKEN_KEY, JSON.stringify(authTokenData))
      return new AuthResponse(true, authTokenData);
    }
    const error = await data.json();
    if (backupResponse.defaultFunction) {
      return backupResponse.defaultFunction({
        errorMessage: error?.msg ?? data.statusText
      });
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

export function getLoginComponentStoreFromLoginResponse(
  response: AuthResponse,
) {
  const email = response?.getData()?.user?.email;
  return {
    [IS_LOGGED_IN_KEY]: response.isLoggedIn(),
    errorMessage: response.getErrorMessage(),
    email: email,
    [GROUP_DESCRIPTION_TEXT]: response.isLoggedIn() ? `Welcome ${email}` : "",
    hasAttemptedLogin: true
  };
}

export const authenticationErrorConfig = {
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
};

export const LOGIN_THUNK: BaseThunk = generateApiThunkWithExternalConfig(
  retrieveData,
  authenticationErrorConfig,
).addGlobalStateReducer((loginState: any) => {
  return {
    [IS_LOGGED_IN_KEY]: loginState.loggedIn,
  };
});
