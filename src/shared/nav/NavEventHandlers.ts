import type {EventHandlerThunkConfig} from "../../framework/state/update/event/types/EventHandlerThunkConfig.ts";
import {
  ADD_GROUP_EVENT_PAGE_ROUTE, CREATE_GROUP_PAGE_ROUTE, DELETE_GROUP_PAGE_ROUTE,
  GROUP_EVENT_PAGE_ROUTE,
  GROUP_PAGE_ROUTE,
  PageComponent
} from "../components/PageComponent.ts";

export const VIEW_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.currentComponent.update(GROUP_PAGE_ROUTE, event.params);
  }
}

export const VIEW_GROUP_EVENT_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.currentComponent.update(GROUP_EVENT_PAGE_ROUTE, event.params);
  }
}

export const ADD_EVENT_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.currentComponent.update(ADD_GROUP_EVENT_PAGE_ROUTE, event.params);
  }
}

export const DELETE_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.currentComponent.update(DELETE_GROUP_PAGE_ROUTE, event.params);
  }
}


export const CREATE_GROUP_PAGE_HANDLER_CONFIG: EventHandlerThunkConfig = {
  eventHandler: function(event){
    PageComponent.currentComponent.update(CREATE_GROUP_PAGE_ROUTE, event.params);
  }
}
