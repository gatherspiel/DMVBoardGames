//@ts-ignore
import type {EventHandlerThunkConfig} from "../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";

export const HOMEPAGE_COMPONENT_NAV: EventHandlerThunkConfig = {

  //@ts-ignore
  eventHandler: (event)=>{

    console.log(`Updating with ${event.params.location}`);

    return {
      hideEvents: event.params.location !== '#event-search',
      hideConventions: event.params.location !== '#convention-list',
      hideRestaurants: event.params.location !== '#game-restaurant',
      hideGameStores: event.params.location !== '#game-store'
    }

  },
}

