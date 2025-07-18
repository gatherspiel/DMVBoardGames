import type {EventHandlerThunkConfig} from "../../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {PageComponent} from "../../../../shared/components/PageComponent.ts";

export const EVENT_LIST_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(params){
    console.log(params)
    PageComponent.currentComponent.update();
  }
}