import { AuthResponse } from "../../ui/user/AuthResponse.ts";
import {
  addLocalStorageData,
  clearSessionStorage,
  CustomLoadAction,
  getLocalStorageDataIfPresent
} from "@bponnaluri/places-js";
import {AUTH_TOKEN_KEY, SUPABASE_CLIENT_KEY, SUPABASE_CLIENT_URL} from "../../shared/Params.ts";

import {DataStore} from "@bponnaluri/places-js";

async function retrieveData(
  params: any
): Promise<AuthResponse> {

  try {
    const authData = await getLocalStorageDataIfPresent(AUTH_TOKEN_KEY);
    if (authData && authData.expires_at * 1000 > new Date().getTime()) {
      return new AuthResponse(
        true,
        authData
      )
    }

    const data:Response = await fetch(
      `${SUPABASE_CLIENT_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers:{
          apiKey: SUPABASE_CLIENT_KEY,
        },
        body:JSON.stringify({
          email:params.formInputs.username,
          password: params.formInputs.password
        })
      }
    )

    if (data.ok) {
      clearSessionStorage();
      const authTokenData = await data.json();
      addLocalStorageData(AUTH_TOKEN_KEY, JSON.stringify(authTokenData))
      return new AuthResponse(true, {...authTokenData,username:authData?.username});
    }

    throw Error((await data.json())?.msg ?? data.statusText)

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

export const LOGIN_STORE: DataStore = new DataStore(new CustomLoadAction(retrieveData));