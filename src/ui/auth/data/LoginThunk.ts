import { AuthResponse } from "../types/AuthResponse.ts";
import {addLocalStorageData, clearSessionStorage, getLocalStorageDataIfPresent} from "@bponnaluri/places-js";
import { isAfterNow } from "@bponnaluri/places-js";
import {AUTH_TOKEN_KEY, SUPABASE_CLIENT_KEY, SUPABASE_CLIENT_URL} from "../../../shared/Params.ts";

import {generateApiThunkWithExternalConfig} from "@bponnaluri/places-js";
import {BaseThunk} from "@bponnaluri/places-js";

async function retrieveData(
  data: any
): Promise<AuthResponse> {

  const params = data.formInputs;
  try {

    const authData = await getLocalStorageDataIfPresent(AUTH_TOKEN_KEY);
    if (authData && isAfterNow(authData.expires_at)) {
      return new AuthResponse(
        true,
        authData
      )
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
      clearSessionStorage();
      const authTokenData = await data.json();
      addLocalStorageData(AUTH_TOKEN_KEY, JSON.stringify(authTokenData))
      return new AuthResponse(true, {...authTokenData,username:authData?.username});
    }

    const error = await data.json();
    throw Error(error?.msg ?? data.statusText)

  } catch (e: any) {

    if (e.message instanceof AuthResponse) {
      console.error("Authentication error");
      return new AuthResponse(
        false,
        e.message.getData(),
        e.message.getErrorMessage().toString(),
      );
    } else {
      return new AuthResponse(false, {}, e.message);
    }
  }
}


export const LOGIN_THUNK: BaseThunk = generateApiThunkWithExternalConfig(
  retrieveData,
)
