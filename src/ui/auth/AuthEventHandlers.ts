import {
  AUTH_REQUEST_STATE,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "./Constants.js";
import type { EventHandlerConfig } from "../../framework/update/event/types/EventHandlerConfig.ts";

export const LOGIN_EVENT_CONFIG: EventHandlerConfig = {
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
  stateToUpdate: AUTH_REQUEST_STATE,
};
