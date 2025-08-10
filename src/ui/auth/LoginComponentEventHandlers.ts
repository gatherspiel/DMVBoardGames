import {
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "./Constants.js";
import type { EventHandlerThunkConfig } from "../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import type { EventHandlerData } from "../../framework/state/update/event/types/EventHandlerData.ts";
import {REGISTER_USER_THUNK} from "./data/RegisterUserThunk.ts";
import {LOGOUT_THUNK} from "./data/LogoutThunk.ts";
import {LOGIN_THUNK} from "./data/LoginThunk.ts";
import type {FormSelector} from "../../framework/FormSelector.ts";
import type {EventValidationResult} from "../../framework/state/update/event/types/EventValidationResult.ts";

const loginInputValidator=
  (formSelector: FormSelector): EventValidationResult  => {

  if(!formSelector.getValue(USERNAME_INPUT) || !formSelector.getValue(PASSWORD_INPUT)) {
    return {
      errorMessage: "Enter a valid username and password"
    }
  }
  return {};
}

export const LOGIN_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: params => {
    return {
      username: params.formSelector.getValue(USERNAME_INPUT),
      password: params.formSelector.getValue(PASSWORD_INPUT)
    };
  },
  validator: loginInputValidator,
  apiRequestThunk: LOGIN_THUNK,
};

export const LOGOUT_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler:  ()=> {},
  apiRequestThunk: LOGOUT_THUNK
};

export const REGISTER_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler:  (params: EventHandlerData) => {
    return {
      username: params.formSelector.getValue(USERNAME_INPUT),
      password: params.formSelector.getValue(PASSWORD_INPUT),
    };
  },
  validator: loginInputValidator,
  apiRequestThunk: REGISTER_USER_THUNK
};
