import { SEARCH_COMPONENT_STATE } from "./Constants.ts";
import { SEARCH_REQUEST_STATE } from "./Constants.ts";

import type { EventHandlerData } from "../../../../framework/update/event/types/EventHandlerData.ts";
import type { EventHandlerConfig } from "../../../../framework/update/event/types/EventHandlerConfig.ts";
export const SEARCH_EVENT_HANDLER_CONFIG: EventHandlerConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      location: params.componentState.location,
      day: params.componentState.day,
    };
  },
  stateToUpdate: SEARCH_REQUEST_STATE,
};

export const UPDATE_CITY_CONFIG: EventHandlerConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      location: (params.event?.target as HTMLInputElement).value,
    };
  },
  stateToUpdate: SEARCH_COMPONENT_STATE,
};

export const UPDATE_DAY_CONFIG: EventHandlerConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      day: (params.event?.target as HTMLInputElement).value,
    };
  },
  stateToUpdate: SEARCH_COMPONENT_STATE,
};
