import { SEARCH_REQUEST_STORE } from "./Constants.ts";

import type { EventHandlerData } from "../../../../framework/store/update/event/types/EventHandlerData.ts";
import type { EventHandlerReducerConfig } from "../../../../framework/store/update/event/types/EventHandlerReducerConfig.ts";
export const SEARCH_EVENT_HANDLER_CONFIG: EventHandlerReducerConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      location: params.componentStore.location,
      day: params.componentStore.day,
    };
  },
  storeToUpdate: SEARCH_REQUEST_STORE,
};

export const UPDATE_CITY_CONFIG: EventHandlerReducerConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      location: (params.event?.target as HTMLInputElement).value,
    };
  },
};

export const UPDATE_DAY_CONFIG: EventHandlerReducerConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      day: (params.event?.target as HTMLInputElement).value,
    };
  },
};
