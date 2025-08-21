import type { EventHandlerData } from "@bponnaluri/places-js";
import type { EventHandlerThunkConfig } from "@bponnaluri/places-js";
import {EVENT_SEARCH_THUNK} from "../../data/search/EventSearchThunk.ts";
export const SEARCH_EVENT_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler:  (params: EventHandlerData) => {
    let searchParams:any = {
      location: params.componentStore.location,
      day: params.componentStore.day,
      distance: params.componentStore.distance
    };
    return searchParams;
  },

  componentReducer: data => {
    return data
  },
  apiRequestThunk: EVENT_SEARCH_THUNK
};

export const UPDATE_CITY_CONFIG: EventHandlerThunkConfig = {
  eventHandler:  (params: EventHandlerData) => {
    params.component.retrieveData({
      location: (params.event?.target as HTMLInputElement).value,
    })
  }
};

export const UPDATE_DAY_CONFIG: EventHandlerThunkConfig = {
  eventHandler:  (params: EventHandlerData) =>{
    params.component.retrieveData({
      day: (params.event?.target as HTMLInputElement).value,
    })

  },
};

export const UPDATE_DISTANCE_CONFIG: EventHandlerThunkConfig = {
  eventHandler: (params: EventHandlerData) => {
    return {
      distance: (params.event?.target as HTMLInputElement).value
    }
  }
}
