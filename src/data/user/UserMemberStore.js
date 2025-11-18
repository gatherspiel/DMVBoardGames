import {ApiLoadAction, DataStore} from "@bponnaluri/places-js";
import {API_ROOT} from "../../ui/shared/Params.js";

function getUserMemberDataStore(){

  return {
    url: API_ROOT + "/user/memberData",
  };
}

export const USER_MEMBER_STORE = new DataStore(new ApiLoadAction(getUserMemberDataStore))

