import {CustomLoadAction, DataStore} from "@bponnaluri/places-js";
import { AuthResponse } from "../../ui/user/AuthResponse.js";
import {AUTH_TOKEN_KEY, SUPABASE_CLIENT_KEY, SUPABASE_CLIENT_URL} from "../../ui/shared/Params.js";
import {deleteLocalStoreData, getLocalStorageDataIfPresent} from "@bponnaluri/places-js";

async function retrieveData() {

  const data = await fetch(
    `${SUPABASE_CLIENT_URL}/auth/v1/logout?scope=global`, {
      method: "POST",
      headers:{
        apiKey: SUPABASE_CLIENT_KEY,
        authorization: "bearer "+(await getLocalStorageDataIfPresent(AUTH_TOKEN_KEY))?.access_token
      }
    }
  )
  if (data.ok) {
    deleteLocalStoreData(AUTH_TOKEN_KEY)
    window.location.assign('/index.html');
    return new AuthResponse(false);
  } else {
    return new AuthResponse(true, {},"Failed to logout:"+JSON.stringify(data));
  }
}

export const LOGOUT_STORE = new DataStore(new CustomLoadAction(retrieveData));
