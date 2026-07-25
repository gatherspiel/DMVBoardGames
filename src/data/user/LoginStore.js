import {
  AUTH_TOKEN_KEY,
  SUPABASE_CLIENT_KEY,
  SUPABASE_CLIENT_URL,
} from "../../ui/shared/Params.js";
import {
  CustomLoadAction,
  DataStore,
} from "/lib/places-js-latest.js";

import { AuthResponse } from "../../ui/user/AuthResponse.js";

export const IS_LOGGED_IN_KEY = "loggedIn";

async function retrieveData(params) {
  try {
    let authData = null;
    const authToken = window.localStorage["authToken"];
    if(authToken){
      authData = JSON.parse(authToken);
    }
    if (authData && authData.expires_at * 1000 > new Date().getTime()) {
      return new AuthResponse(true, authData);
    }

    const data = await fetch(
      `${SUPABASE_CLIENT_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          apiKey: SUPABASE_CLIENT_KEY,
        },
        body: JSON.stringify({
          email: params.formInputs.username,
          password: params.formInputs.password,
        }),
      },
    );

    if (data.ok) {
     for(let i = 0; i< sessionStorage.length; i++){
        const key = sessionStorage.key(i);
        sessionStorage.setItem(key, JSON.stringify({}))
      } 
      const authTokenData = await data.json();
      window.localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authTokenData));
      return new AuthResponse(true, {
        ...authTokenData,
        username: authData?.username,
      });
    }

    throw Error((await data.json())?.msg ?? data.statusText);
  } catch (e) {
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

export const LOGIN_STORE = new DataStore(new CustomLoadAction(retrieveData));
