//@ts-ignore
import type {EventHandlerThunkConfig} from "../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";

export const HOMEPAGE_COMPONENT_NAV: EventHandlerThunkConfig = {

  //@ts-ignore
  eventHandler: function(event){

    if(event.params.location === '#convention-list'){
      return {
        hideEvents: true,
        hideConventions: false,
        hideRestaurants: true,
        hideStores: true
      }
    }

    if(event.params.location === '#game-store'){
      return {
        hideEvents: true,
        hideConventions: true,
        hideRestaurants: true,
        hideStores: false
      }
    }

    if(event.params.location === '#game-restaurant-list'){
      return {
        hideEvents: true,
        hideConventions: true,
        hideRestaurants: false,
        hideStores: true
      }
    }

  },
}

