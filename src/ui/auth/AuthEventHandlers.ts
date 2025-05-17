import {
  AUTH_REQUEST_STATE,
  LOGIN_FORM_ID,
  PASSWORD_INPUT,
  USERNAME_INPUT,
} from "./Constants.js";
import type { EventHandlerConfig } from "../../framework/update/event/EventHandlerFactory.ts";
import { getElementWithId } from "../../framework/components/utils/ComponentUtils.ts";
export const LOGIN_EVENT_CONFIG: EventHandlerConfig = {
  eventName: "submit",
  selectorFunction: function (): Element {
    return getElementWithId(LOGIN_FORM_ID);
  },
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
