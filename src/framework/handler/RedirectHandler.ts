import type {EventHandlerThunkConfig} from "../state/update/event/types/EventHandlerThunkConfig.ts";
import type {EventHandlerData} from "../state/update/event/types/EventHandlerData.ts";

export const REDIRECT_HANDLER_CONFIG: EventHandlerThunkConfig = {
  //@ts-ignore
  eventHandler: function(event: EventHandlerData){
    window.location.href = event.params.url;
  }
}
