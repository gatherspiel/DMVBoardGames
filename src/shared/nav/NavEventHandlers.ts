import type {EventHandlerThunkConfig} from "../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {GROUP_EVENT_PAGE_ROUTE, GROUP_PAGE_ROUTE, PageComponent} from "../components/PageComponent.ts";

export const VIEW_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  //@ts-ignore
  eventHandler: function(event){
    console.log("Click event time:"+Date.now());
    PageComponent.currentComponent.update(GROUP_PAGE_ROUTE, event.params);
  }
}


export const VIEW_GROUP_EVENT_HANDLER_CONFIG: EventHandlerThunkConfig = {
  //@ts-ignore
  eventHandler: function(event){
    console.log("Click event time:"+Date.now());
    PageComponent.currentComponent.update(GROUP_EVENT_PAGE_ROUTE, event.params);
  }
}