import type { BaseThunk } from "../../../framework/state/update/BaseThunk.ts";
import { generateApiThunk } from "../../../framework/state/update/api/ApiThunkFactory.ts";
import { API_ROOT } from "../../../shared/params.ts";
import type { ApiRequestConfig } from "../../../framework/state/update/api/types/ApiRequestConfig.ts";

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
    successMessage: response.errorMessage ? "" : "Successfully registered user",
  };
}

export const REGISTER_USER_THUNK: BaseThunk = generateApiThunk({
  queryConfig: registerUserConfig,
}).addGlobalStateReducer(() => {
  return {
    isLoggedIn: "false",
  };
});
