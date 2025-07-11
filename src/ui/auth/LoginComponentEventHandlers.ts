import {
  AUTH_REQUEST_STORE,
  LOGOUT_REQUEST_STORE,
  PASSWORD_INPUT,
  REGISTER_REQUEST_STORE,
  USERNAME_INPUT,
} from "./Constants.js";
import type { EventHandlerThunkConfig } from "../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import type { EventHandlerData } from "../../framework/state/update/event/types/EventHandlerData.ts";

export const LOGIN_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      username: params.formSelector.getValue(USERNAME_INPUT),
      password: params.formSelector.getValue(PASSWORD_INPUT)
    };
  },
  requestStoreToUpdate: AUTH_REQUEST_STORE,
};

export const LOGOUT_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function () {},
  requestStoreToUpdate: LOGOUT_REQUEST_STORE,
};

export const REGISTER_EVENT_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      username: params.formSelector.getValue(USERNAME_INPUT),
      password: params.formSelector.getValue(PASSWORD_INPUT),
    };
  },
  requestStoreToUpdate: REGISTER_REQUEST_STORE,
};
