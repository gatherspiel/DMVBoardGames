import type { BaseThunk } from "@bponnaluri/places-js";
import { generateApiThunk } from "@bponnaluri/places-js";
import { API_ROOT } from "../../../shared/Params.ts";
import type { ApiRequestConfig } from "@bponnaluri/places-js";
import {IS_LOGGED_IN_KEY, SUCCESS_MESSAGE_KEY} from "../../../shared/Constants.ts";

function registerUserConfig(params: any): ApiRequestConfig {
  const requestBody = {
    email: params.username,
    password: params.password,
  };
  return {
    body: JSON.stringify(requestBody),
    method: "POST",
    url: API_ROOT + `/users/register`,
  };
}

export function getLoginComponentStoreFromRegisterResponse(response: any) {
  return {
    errorMessage: response.errorMessage,
    [SUCCESS_MESSAGE_KEY]: response.errorMessage ? "" : "Successfully registered user",
  };
}

export const REGISTER_USER_THUNK: BaseThunk = generateApiThunk({
  queryConfig: registerUserConfig,
}).addGlobalStateReducer(() => {
  return {
    [IS_LOGGED_IN_KEY]: "false",
  };
});
