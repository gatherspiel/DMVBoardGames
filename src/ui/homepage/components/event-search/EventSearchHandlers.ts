import type { EventHandlerData } from "../../../../framework/state/update/event/types/EventHandlerData.ts";
import type { EventHandlerThunkConfig } from "../../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {EVENT_SEARCH_THUNK} from "../../data/search/EventSearchThunk.ts";
export const SEARCH_EVENT_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      location: params.componentStore.location,
      day: params.componentStore.day,
    };
  },
  apiRequestThunk: EVENT_SEARCH_THUNK
};

export const UPDATE_CITY_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      location: (params.event?.target as HTMLInputElement).value,
    };
  },
};

export const UPDATE_DAY_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function (params: EventHandlerData) {
    return {
      day: (params.event?.target as HTMLInputElement).value,
    };
  },
};
