import {CustomLoadAction, DataStore} from "@bponnaluri/places-js";
import { AuthResponse } from "../types/AuthResponse.ts";
import {AUTH_TOKEN_KEY, SUPABASE_CLIENT_KEY, SUPABASE_CLIENT_URL} from "../../../shared/Params.ts";
import {deleteLocalStoreData, getLocalStorageDataIfPresent} from "@bponnaluri/places-js";

async function retrieveData() {

  const url = `${SUPABASE_CLIENT_URL}/auth/v1/logout?scope=global`
  const authData = await getLocalStorageDataIfPresent(AUTH_TOKEN_KEY);

  const headers = {
    apiKey: SUPABASE_CLIENT_KEY,
    authorization: "bearer "+authData.access_token
  }

  const data:Response = await fetch(
   url, {
      method: "POST",
      headers:headers
    }
  )

  if (data.ok) {
    deleteLocalStoreData(AUTH_TOKEN_KEY)
    return new AuthResponse(false);
  } else {
    return new AuthResponse(true, {},"Failed to logout:"+JSON.stringify(data));
  }
}




export const LOGOUT_STORE: DataStore = new DataStore(new CustomLoadAction(retrieveData));

