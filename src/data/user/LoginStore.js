import {
  AUTH_TOKEN_KEY,
  SUPABASE_CLIENT_KEY,
  SUPABASE_CLIENT_URL,
} from "/shared/Params.js";

import { AuthResponse } from "../../ui/user/AuthResponse.js";
import { CustomLoadSignal,DataStore } from "/lib/places-js-latest.js";

export const IS_LOGGED_IN_KEY = "loggedIn";

async function retrieveData(params) {
  try {
    let authData = null;
    const authToken = window.localStorage["authToken"];
    if (authToken) {
      authData = JSON.parse(authToken);
    }

    if (authData && authData.expires_at * 1000 > new Date().getTime()) {
			return {
				isLoggedIn:true,
				"authData":authData

			}
    }

		if(!params.formInputs){
			return {
				isLoggedIn:false
			}
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
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        sessionStorage.setItem(key, JSON.stringify({}));
      }
      const authTokenData = await data.json();
      window.localStorage.setItem(
        AUTH_TOKEN_KEY,
        JSON.stringify(authTokenData),
      );

			window.location.assign("/html/user/memberData.html");
      return new AuthResponse(true, {
        ...authTokenData,
        username: authData?.username,
      });
    }
		else {
			const output = await data.json();
			return {	
				isLoggedIn: false,
				loginError: output.msg
			}
		}
  } catch (e) {
    if (e.message instanceof AuthResponse) {
      console.error("Authentication error");
      return new AuthResponse(
        false,
        e.message.getData(),
        e.message.getErrorMessage().toString(),
      );
    } else {
			return {
				isLoggedIn: false,
				loginError: e.message
			}
    }
  }
}

const loginStateSignals = {
	update: {
		newUserMessage:(state)=>{
			
			if(state.isNewUser){
				return `<h2>Account successfully confirmed. Use this page to login</h2>`
			}
			return		``;
		},
		loginError:(data)=>{
			if(data.loginError){
				return data.loginError
			}
			return ""
		}
	}
}

export const LOGIN_STORE =
	DataStore.createWithCustomLoadSignal({
		"loadAction":retrieveData,
		"storeName":"login-store",
		"presentationSignals":loginStateSignals
	});

