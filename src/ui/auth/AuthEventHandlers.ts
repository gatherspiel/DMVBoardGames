import {
  AUTH_REQUEST_STORE,
  LOGOUT_REQUEST_STORE,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "./Constants.js";
import type { EventHandlerReducerConfig } from "../../framework/reducer/event/types/EventHandlerReducerConfig.ts";

export const LOGIN_EVENT_CONFIG: EventHandlerReducerConfig = {
  eventHandler: function () {
    return {
      username:
        (document.getElementById(USERNAME_INPUT) as HTMLInputElement)?.value ??
        "",
      password:
        (document.getElementById(PASSWORD_INPUT) as HTMLInputElement)?.value ??
        "",
    };
  },
  storeToUpdate: AUTH_REQUEST_STORE,
};

export const LOGOUT_EVENT_CONFIG: EventHandlerReducerConfig = {
  eventHandler: function () {
    console.log("Logging out");
  },
  storeToUpdate: LOGOUT_REQUEST_STORE,
};
