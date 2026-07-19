import { ApiLoadAction, DataStore } from "/lib/places-js-latest.js";
import { API_ROOT } from "../../ui/shared/Params.js";

function getUserMemberDataStore() {
  return {
    url: API_ROOT + "/user/memberData",
  };
}

export const USER_MEMBER_STORE = new DataStore(
  new ApiLoadAction(getUserMemberDataStore),
);
