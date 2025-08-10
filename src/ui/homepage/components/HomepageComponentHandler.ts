//@ts-ignore
import type {EventHandlerThunkConfig} from "../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";

export const HOMEPAGE_COMPONENT_NAV: EventHandlerThunkConfig = {

  //@ts-ignore
  eventHandler: (event)=>{


    if(event.params.location === '#event-search'){
      return {
        hideEvents: false,
        hideConventions: true,
        hideRestaurants: true,
        hideGameStores: true
      }
    }

    if(event.params.location === '#convention-list'){
      return {
        hideEvents: true,
        hideConventions: false,
        hideRestaurants: true,
        hideGameStores: true
      }
    }

    if(event.params.location === '#game-store'){
      return {
        hideEvents: true,
        hideConventions: true,
        hideRestaurants: true,
        hideGameStores: false
      }
    }

    if(event.params.location === '#game-restaurant'){
      return {
        hideEvents: true,
        hideConventions: true,
        hideRestaurants: false,
        hideGameStores: true
      }
    }

  },
}

