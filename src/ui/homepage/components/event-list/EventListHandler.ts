import type {EventHandlerThunkConfig} from "../../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";

export const GROUP_WEBPAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  //@ts-ignore
  eventHandler: function(event){
    window.location.href = event.params.url;
  }
}
