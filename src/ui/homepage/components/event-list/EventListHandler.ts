import type {EventHandlerThunkConfig} from "../../../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {GROUP_PAGE_ROUTE, PageComponent} from "../../../../shared/components/PageComponent.ts";

export const EVENT_LIST_HANDLER_CONFIG: EventHandlerThunkConfig = {

  //@ts-ignore
  eventHandler: function(event){
    PageComponent.currentComponent.update(GROUP_PAGE_ROUTE, event.params);
  }
}