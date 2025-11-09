import {ApiLoadAction, type ApiRequestConfig, DataStore} from "@bponnaluri/places-js";
import {API_ROOT} from "../../ui/shared/Params.ts";

function getUserMemberDataStore(): ApiRequestConfig {

  return {
    url: API_ROOT + "/user/memberData",
  };
}

export const USER_MEMBER_STORE = new DataStore(new ApiLoadAction(getUserMemberDataStore))

