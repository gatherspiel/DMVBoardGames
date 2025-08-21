//@ts-ignore
import type {EventHandlerThunkConfig} from "@bponnaluri/places-js";

export const HOMEPAGE_COMPONENT_NAV: EventHandlerThunkConfig = {

  //@ts-ignore
  eventHandler: (event)=>{

    console.log(Date.now())
    return {
      hideEvents: event.params.location !== '#event-search',
      hideConventions: event.params.location !== '#convention-list',
      hideRestaurants: event.params.location !== '#game-restaurant',
      hideGameStores: event.params.location !== '#game-store'
    }

  },
}

